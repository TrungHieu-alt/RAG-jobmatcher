BEGIN_INSTRUCTIONS

All APIs below must be treated as strict schema. AI must never add new fields or change field names.

USER API

POST /users/register
Request:

email: string

password: string

role: string
Response:

user_id: int

email: string

role: string

created_at: datetime

POST /users/login
Request:

email: string

password: string
Response:

access_token: string

refresh_token: string

token_type: string

GET /users/{id}
Response:

id: int

email: string

role: string

created_at: datetime

updated_at: datetime

DELETE /users/{id}
Response:

status: string

CANDIDATE PROFILE API

GET /candidate/profile/{id}
Response:

user_id: int

full_name: string

location: string

experience_years: number

skills: list[string]

summary: string

created_at: datetime

updated_at: datetime

PUT /candidate/profile/{id}
Request: any subset of candidate fields
Response: updated candidate profile

RECRUITER PROFILE API

POST /recruiter/profile
Request:

company_name: string

recruiter_title: string

company_logo: string

about_company: string

hiring_fields: list[string]
Response:

user_id: int

company_name: string

recruiter_title: string

company_logo: string

about_company: string

hiring_fields: list[string]

created_at: datetime

GET /recruiter/profile/{id}
Response:

user_id: int

company_name: string

recruiter_title: string

company_logo: string

about_company: string

hiring_fields: list[string]

created_at: datetime

updated_at: datetime

PUT /recruiter/profile/{id}
Request: any subset of recruiter fields
Response: updated recruiter profile

JOB POST API

POST /jobs/create
Request:

title: string

role: string

location: string

job_type: string

experience_level: string

skills: list[string]

salary_min: number

salary_max: number

full_text: string
Response:

id: int

recruiter_id: int

title: string

role: string

location: string

job_type: string

experience_level: string

skills: list[string]

salary_min: number

salary_max: number

full_text: string

created_at: datetime

POST /jobs/upload
Request: file
Response: job object (same fields as above)

GET /jobs
Query params:

role: string optional

location: string optional
Response list items:

id: int

title: string

role: string

location: string

salary_min: number

salary_max: number

skills: list[string]

created_at: datetime

GET /jobs/{id}
Response:

id: int

recruiter_id: int

title: string

role: string

location: string

job_type: string

experience_level: string

skills: list[string]

salary_min: number

salary_max: number

full_text: string

created_at: datetime

updated_at: datetime

PUT /jobs/{id}
Request: any subset of job fields
Response: updated job

DELETE /jobs/{id}
Response:

status: string

CV API

POST /cv/create
Request:

title: string

location: string

experience_years: number

skills: list[string]

summary: string

full_text: string
Response:

id: int

user_id: int

title: string

location: string

experience_years: number

skills: list[string]

summary: string

full_text: string

created_at: datetime

POST /cv/upload
Request: file
Response: CV object (same fields as above)

GET /cv/{id}
Response:

id: int

user_id: int

title: string

skills: list[string]

summary: string

full_text: string

GET /cvs/user/{user_id}
Response: list of CV objects

GET /cv/main/user/{user_id}
Response: CV object

PUT /cv/{id}
Request: any subset of CV fields
Response: updated CV

DELETE /cv/{id}
Response: status string

APPLICATION API

POST /applications
Request:

job_id: int

cv_id: int
Response:

id: int

job_id: int

candidate_id: int

status: string

created_at: datetime

GET /applications/job/{job_id}
Response list items:

application_id: int

candidate_id: int

cv_id: int

status: string

applied_at: datetime

GET /applications/candidate/{user_id}
Response: list of applications

PUT /applications/{id}
Request:

status: string
Response: updated application

DELETE /applications/{id}
Response: status string

MATCH API

GET /match/cv/{cv_id}
Response list items:

job_id: int

job_title: string

score: number

GET /match/job/{job_id}
Response list items:

cv_id: int

candidate_name: string

score: number

POST /match/recompute/cv/{cv_id}
Response:

job_id: int

updated: boolean

updated_at: datetime

POST /match/recompute/job/{job_id}
Response: updated match info

SYSTEM API

GET /health
Response: status string

POST /auth/refresh
Request:

refresh_token: string
Response:

access_token: string

AI CODING RULES

No additional fields outside this schema.

Frontend: camelCase. Backend: snake_case.

Always use TypeScript types, no "any".

Wrap all API calls in try/catch.

Keep code minimal, predictable, strictly matching schema.