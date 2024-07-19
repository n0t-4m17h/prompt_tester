# prompt_tester

LLM quality prompt tester

## Assumptions and Resolutions

- System Admin will simply have a list of all Paid Users, and every option they also have (hence "...access to all user information...").
  - special set of credentials, no unique UI either (other than list of Paid Users)
  - maybe just /notadmin route to enter special creds

## Set up and Run program

(installation of dependencies, etc)

In the `backend/` directory:

- run `$ pip install -r requirements.txt`
- run `echo "BACKEND_PORT=8000" > .env`
  - or a port no. of your choice, but must be same set as frontends
- run backend via `$ fastapi dev main.py`

In the `frontend/` directory:

- run `$ npm install`
- run `echo "BACKEND_PORT=8000" > .env`
  - or a port no. of your choice, but must be same set as backends
- run frontend via `$ npm run dev`

## A list of resources referred or used

## References
