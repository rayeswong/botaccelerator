CREATE TABLE  "ODA_ACC_DEMO_FILES" 
   (	"ID" NUMBER, 
	"FILENAME" VARCHAR2(4000),  
    "NAME" VARCHAR2(128),
    "VERSION" VARCHAR2(64),
    "LANGUAGE" VARCHAR2(64),
	"FILE_MIMETYPE" VARCHAR2(512), 
    "FILE_CSV" VARCHAR2(512), 
    "FILE_YAML" VARCHAR2(512), 
	"FILE_BLOB" BLOB, 
	"CREATED" TIMESTAMP (6) WITH LOCAL TIME ZONE, 
	"CREATED_BY" VARCHAR2(255), 
	"UPDATED" TIMESTAMP (6) WITH LOCAL TIME ZONE, 
	"UPDATED_BY" VARCHAR2(255), 
	 CONSTRAINT "ODA_ACC_DEMO_FILES_PK" PRIMARY KEY ("ID")
  USING INDEX  ENABLE
   )

CREATE OR REPLACE EDITIONABLE TRIGGER  "BIU_ODA_ACC_DEMO_FILES" 
   before insert or update on ODA_ACC_DEMO_FILES
   for each row
begin
   if :new.ID is null then
     select to_number(sys_guid(),'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') into :new.id from dual;
   end if;
   if inserting then
       :new.created := localtimestamp;
       :new.created_by := nvl(wwv_flow.g_user,user);
       :new.updated := localtimestamp;
       :new.updated_by := nvl(wwv_flow.g_user,user);
   elsif updating and :new.filename is not null and nvl(dbms_lob.getlength(:new.file_blob),0) > 15728640 then
       raise_application_error(-20000, 'The size of the uploaded file was over 15MB. Please upload a smaller sized file.');
   end if;
   if inserting or updating then
       :new.updated := localtimestamp;
       :new.updated_by := nvl(wwv_flow.g_user,user);
   end if;
end;

/
ALTER TRIGGER  "BIU_ODA_ACC_DEMO_FILES" ENABLE
/