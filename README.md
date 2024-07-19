# prompt_tester

LLM quality prompt tester

## Assumptions and Resolutions

- System Admin will simply have a list of all Paid Users, and every option they also have (hence "...access to all user information...").
  - special set of credentials, no unique UI either (other than list of Paid Users)
  - maybe just /notadmin route to enter special creds

## Setting up the Program

### Backend

Assuming universal packages such as python3 and git are installed- `cd` into `backend/`, then:

- [PostgreSQL](https://www.postgresql.org/download/) might need to be installed
  - check if installed via `$ psql --version`, otherwise run `$ sudo apt update` and then `$ sudo apt install postgresql postgresql-contrib`
  - start postgresql via `$ sudo service postgresql start`
  - switch to postgres user via `$ sudo -i -u postgres`
  - start the postgres terminal via `$ psql`
  - create a new user via `postgres=# CREATE USER <user_name> WITH PASSWORD '<password>';`
  - create a db for this project, via `postgres=# CREATE DATABASE prompt_tester;`
  - grant your newly created user full access to this db, via `postgres=# GRANT ALL PRIVILEGES ON DATABASE prompt_tester TO <user_name>;`
  - exit postgresql terminal and user session, via `postgres=# \q` and `$ exit`
- Add your new PostgreSQL credentials to `.env` file, via `$ echo DATABASE_URL=postgresql://<user_name>:<password>@localhost/promp_tester >> .env`
- run `$ pip install -r requirements.txt`
- run `$ echo "BACKEND_PORT=8000" >> .env`
  - or a port no. of your choice, but must be same set as frontends

### Frontend

Assuming universal packages such as node.js is installed- `cd` into `frontend/`, then:

- run `$ npm install`
- run `$ echo "BACKEND_PORT=8000" > .env`
  - or a port no. of your choice, but must be same set as backends

## Running the program

- in one terminal, in `backend/`, run `$ fastapi dev backend/main.py`
- in another terminal, in `frontend/`, run `$ npm run dev`, and open up the displayed URL in your browser

## A list of resources referred or used

## References
