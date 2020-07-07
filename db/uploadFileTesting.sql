set serveroutput on;
declare
	v_req utl_http.req;
	v_resp utl_http.resp;
	v_parts utl_http_multipart.parts := utl_http_multipart.parts();
    bfile blob;
	value VARCHAR2(1024);
begin
    select FILE_BLOB
  	into bfile
  	from ODA_ACC_DEMO_FILES
  	where ID = '221576455817187950188522730093657381676';

	utl_http_multipart.add_file(v_parts, 'template', 'oda design template v1.3.2.xlsx', 'multipart/form-data', bfile);
	utl_http_multipart.add_param(v_parts, 'name', 'mybot');

	v_req := utl_http.begin_request('http://140.238.18.99/botacc/upload', 'POST', 'HTTP/1.1');

	utl_http_multipart.send(v_req, v_parts);

	v_resp := utl_http.get_response(v_req);
	dbms_output.put_line('Response code = ' || v_resp.status_code);
	LOOP
		UTL_HTTP.READ_LINE(v_resp, value, TRUE);
		DBMS_OUTPUT.PUT_LINE(value);
	END LOOP;
end