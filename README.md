# prompt_tester

LLM quality prompt tester

## Assumptions and Resolutions

- System Admin will simply have a list of all Paid Users, and every option they also have (hence "...access to all user information...").
  - special set of credentials, no unique UI either (other than list of Paid Users)
  - maybe just /notadmin route to enter special creds?? idk yet
- Sidebar: Spec only mentions "Prompt Tester" module, so used SideBar to hold previous chats
- Simplified LLM roles to just User and Assistant, along with a single model (feasibility convenience)

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
- Add your new PostgreSQL credentials to `.env` file, via `$ echo DATABASE_URL=postgresql://<user_name>:<password>@localhost/prompt_tester >> .env`
  - note that the database name is specified as "prompt_tester"
- run `$ pip install -r requirements.txt`
- run `$ echo "BACKEND_PORT=8000" >> .env`
  - or a port no. of your choice, but must be same set as frontends
- Sign into [GroqCloud](https://console.groq.com/keys), create an API key, then run `$ echo "GROQ_API_KEY=<key>" >> .env`.

### Frontend

Assuming universal packages such as node.js is installed- `cd` into `frontend/`, then:

- run `$ npm install`
- run `$ echo "BACKEND_PORT=8000" > .env`
  - or a port no. of your choice, but must be same set as backends

## Running the program

- in one terminal, in `backend/`, run `$ sudo service postgresql start` then run `$ fastapi dev main.py`
- in another terminal, in `frontend/`, run `$ npm run dev`, and open up the displayed URL in your browser
  - note that `backend/main.py`'s `app.add_middleware()`'s parameter `allow_origins` should be set to your frontend's origin (url).

## A list of resources referred or used

## References
