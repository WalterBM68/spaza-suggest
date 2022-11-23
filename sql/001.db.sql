create database spaza_suggest;
create role zuggs login password 'suggest123';
grant all privileges on database spaza_suggest to zuggs;

-- for the tests
create database spaza_suggest_test;
create role the_test login password 'suggest123';
grant all privileges on database spaza_suggest_test to the_test;
