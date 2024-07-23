# Prompt Tester

LLM quality prompt tester

## Assumptions and Resolutions

- System Admin has the same feature accessibility as a Paid user, therefore I've decided to conflate the two.
  - Possibly, could support the end user description, "...access to all user information...", by providing system admin UI login with a page of all existing users.
  - could be done via a pre-registered special set of credentials (will require small backend alterations for this)
  - at the same time, all information can be accessed by system admin by swiping the database + logs, so UI seems redundant, unless nothing else to do.
- Sidebar: Spec only mentions "Prompt Tester" module, so I used SideBar to hold previous chats
- Not apart of spec, but simplified msgs to just between User and Assistant, no System (feasibility convenience)

## Future To Dos

- General
  - major refactoring in frontend
  - some refactoring in backend
  - vastly improved UI
  - pylint in BE (disabled due to ceebs)
  - proper functioning logger in BE
- Chat and messages
  - more llm models and parameters
  - delete chats
  - chat filtering options (date, no. of messages)
  - view LLM response option before saving
  - Chat export/import option as JSON format, via OpenAI specs
- User
  - profile page
  - admin UI maybe?

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
  - IF using [DOCKER](https://docs.docker.com/desktop/wsl/#prerequisites), then `$ echo DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/prompt_tester >> .env` exactly as seen, explained down below.
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

- Manual:
  - in one terminal, in `backend/`, run `$ sudo service postgresql start` then run `$ fastapi dev main.py`
  - in another terminal, in `frontend/`, run `$ npm run dev`, and open up the displayed URL in your browser
    - note that `backend/main.py`'s `app.add_middleware()`'s parameter `allow_origins` should be set to your frontend's origin (url).
- DOCKER: (from the root directory)
  - run `$ echo POSTGRES_USER=<user_name> >> .env` then `$ echo POSTGRES_PASSWORD=<password> >> .env`
    - Docker'll use these to grab as variable values for your DATABASE_URL in backend/.env
  - then `$ docker-compose up --build`
    - might need a local npm build, so `$ npm run build` in frontend/

## Progress ⏳

### Task 1: Main “Prompt Tester” Module

1.1 System Prompt Input Box ~ **DONE**

1.2 Chat Box Interface Box ~ **PARTIALLY DONE**

- 1.2.4 bonus streaming incomplete; parameter value set to false for backend implem convenience

### Task 2: Update model parameters

2.1 Update Model Parameters ~ **DONE (for 3 parameters)**

### Task 3: Usability

3.1 Usability ~ **DONE**

- flex boxes used, but app not mobile responsive

### Task 4: Error Handling in Prompt Tester

4.1 Usability ~ **PARTIALLY DONE**

- 4.1.2 and 4.1.3 confidently implemented
- Not all errors are efficiently handled, but user is informed almost all the time
- Logged structure set up (file creation and message), but requires further debugging as to why empty files are created, in `backend/logs`.

### Bonus

B.1 Save and load previous chats ~ **DONE**

B.2 Containerisation ~ **DONE**
- process shown in set up/run guide above

## References and Resources

- [MaterialUI](https://mui.com/)
  - super spoon-fed and quick out-of-the-box components
- [NextJS](https://nextjs.org/docs/getting-started/installation) quick start guide
- StackOverflow
  - also complemented with MUI in most cases, logging, etc. for simple quickly-searchable stuff
- [groqAI](https://console.groq.com/playground) playground and [OpenAI](https://platform.openai.com/docs/guides/chat-completions/getting-started) API
  - starter code, data structure of responses etc.
- good ol' [ChatGPT](https://chatgpt.com/)
  - extremely useful for weighing up pros/cons of certain choices (scalabiity, feasability etc.), info summary, boilerplate code etc. PostgreSQL vs SQLite, fetch vs Axios, localStorage vs cookies etc.
- [SQLAlchemy](https://docs.sqlalchemy.org/en/20/intro.html#installation-guide)
  - basic use due to simple implem db models
- [PostgreSQL](https://dev.to/sfpear/install-and-use-postgres-in-wsl-423d)
  - succint refresher installation/setup doc
- FastAPI [tutorial](https://fastapi.tiangolo.com/tutorial/) and [best practices](https://github.com/zhanymkanov/fastapi-best-practices?tab=readme-ov-file#pydantic)
  - including pydantic models and dependency understandings
- [Docker](https://docs.docker.com/desktop/wsl/#prerequisites) + YouTube
  - for docker installation and setup in wsl2, very new experience
