-- Databases and users for ms-users and ms-wallet
CREATE USER "user" WITH PASSWORD 'password';
CREATE DATABASE ms_users OWNER "user";
GRANT ALL PRIVILEGES ON DATABASE ms_users TO "user";

CREATE USER wallet_user WITH PASSWORD 'wallet_pass';
CREATE DATABASE wallet OWNER wallet_user;
GRANT ALL PRIVILEGES ON DATABASE wallet TO wallet_user;
