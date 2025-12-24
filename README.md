# Mastodon Job Matcher Extension

Dự án gồm backend + frontend để quản lý hồ sơ ứng viên, bài đăng tuyển dụng và thực hiện matching hai chiều. Hệ thống hỗ trợ đăng nhập, quản lý CV/JD, theo dõi ứng tuyển, và trả về kết quả matching có giải thích. README này mô tả toàn bộ sản phẩm, không chỉ riêng RAG.

## Tổng quan sản phẩm
- **Ứng viên**: tạo hồ sơ, tải CV, xem gợi ý việc làm phù hợp, theo dõi đơn ứng tuyển.
- **Nhà tuyển dụng**: tạo bài đăng, xem danh sách ứng viên phù hợp, quản lý matching và phản hồi.
- **Hệ thống matching**: tự động xếp hạng phù hợp CV ↔ JD, trả về score + lý do.

## Tính năng chính
- Xác thực người dùng, phân quyền ứng viên/nhà tuyển dụng.
- Quản lý hồ sơ ứng viên (CV chính, kỹ năng, kinh nghiệm, vị trí).
- Quản lý bài đăng tuyển dụng (role, level, location, skills, mô tả).
- Upload CV/JD từ file (PDF/DOCX/ảnh) hoặc text.
- Matching hai chiều, lưu kết quả và cho phép lọc theo điểm.
- Giao diện web để thao tác và theo dõi kết quả.

## Kiến trúc hệ thống
- **Backend**: FastAPI cung cấp API CRUD và matching.
- **Database**: MongoDB lưu user, CV, JD, match results.
- **Vector store**: ChromaDB lưu embeddings phục vụ truy hồi.
- **AI/RAG**: Gemini parse và đánh giá, SentenceTransformer tạo embeddings.
- **Frontend**: React + Vite + Tailwind + Radix UI.

## High-Level System Diagram
```
            +----------------------+
            |      Frontend UI     |
            |  (React/Vite/TW)     |
            +----------+-----------+
                       |
                       | HTTPS/REST
                       v
            +----------------------+
            |   Backend API        |
            |   (FastAPI)          |
            +----+-----------+-----+
                 |           |
                 |           |
                 v           v
       +----------------+  +-------------------+
       | MongoDB        |  | AI Services       |
       | Users/CVs/JDs  |  | Gemini Parsing &  |
       | Match Results  |  | Evaluation        |
       +----------------+  +---------+---------+
                                      |
                                      v
                              +---------------+
                              | Embeddings    |
                              | MiniLM        |
                              +-------+-------+
                                      |
                                      v
                              +---------------+
                              | ChromaDB      |
                              | Vector Store  |
                              +---------------+
```

## RAG Matching Diagram (chi tiết)
```
Input (CV/JD)
    |
    v
[Preprocess]
  - Read file (PDF/DOCX/Image/Text)
  - OCR nếu cần
  - Detect language + Translate EN
  - Clean + split blocks
    |
    v
[Gemini Parsing]
  CV -> {summary, experience, job_title, skills, location, full_text}
  JD -> {job_description, job_requirement, job_title, skills, location, full_text}
    |
    v
[Embedding - MiniLM]
  emb_summary / emb_experience / emb_skills / emb_full ...
    |
    v
[ChromaDB Vector Store]
  - Lưu emb_full cho ANN
  - Lưu embeddings field trong metadata
    |
    v
[Matching Pipeline]
  Stage 1: ANN Retrieval (top K)
  Stage 2: Weighted Rerank (field weights)
  Stage 3: LLM Evaluate (score + reason)
  Stage 4: Hybrid Score (ann + weighted + llm)
    |
    v
[Output]
  - Ranked list + reason
  - Lưu MatchResult vào MongoDB
```

## Luồng xử lý (tóm tắt)
1) Người dùng tải CV/JD hoặc nhập text
2) Hệ thống preprocess, parse và lưu dữ liệu
3) Sinh embeddings, lưu vào ChromaDB
4) Matching: truy hồi, rerank, LLM evaluate
5) Lưu match và hiển thị kết quả trên UI

## Flow chart (tổng thể)
```
Người dùng
   |
   v
Frontend UI  --->  Backend API  --->  MongoDB (CRUD)
   |                 |
   |                 v
   |             RAG Pipeline
   |                 |
   |                 v
   +------------> ChromaDB (Vector Store)
                     |
                     v
                Kết quả matching
                     |
                     v
                 Hiển thị UI
```

## Use case chính
### Ứng viên
- Đăng ký/đăng nhập.
- Tạo hồ sơ ứng viên.
- Upload CV (PDF/DOCX/ảnh) hoặc nhập text.
- Xem gợi ý việc làm phù hợp.
- Theo dõi đơn ứng tuyển đã gửi.

### Nhà tuyển dụng
- Đăng ký/đăng nhập.
- Tạo hồ sơ nhà tuyển dụng.
- Đăng bài tuyển dụng.
- Chạy matching tìm ứng viên phù hợp.
- Xem danh sách ứng viên + lý do phù hợp.
- Quản lý phản hồi và trạng thái.

## Cấu trúc UI (tóm tắt)
- **AuthPage**: Đăng nhập/đăng ký/quên mật khẩu.
- **OnBoardingPage**: Chọn vai trò (Candidate/Recruiter).
- **CandidatePage**:
  - Dashboard
  - My CVs (upload/quản lý)
  - Job Matching (gợi ý công việc)
  - Applied Jobs (đơn đã ứng tuyển)
  - Settings
- **RecruiterPage**:
  - Dashboard
  - Job Posts (tạo/quản lý bài đăng)
  - Candidate Manager + Detail modal
  - Matching Tracker
  - Analytics
  - Settings

## Các bảng/collection DB (tóm tắt)
- **users**: thông tin tài khoản, vai trò, email, password hash.
- **candidate_profiles**: thông tin ứng viên (hồ sơ).
- **recruiter_profiles**: thông tin nhà tuyển dụng.
- **candidate_resumes**: CV (title, location, experience, skills, summary, full_text, pdf_url, user_id, is_main).
- **job_posts**: bài đăng (title, role, location, job_type, experience_level, skills, salary_min/max, full_text, recruiter_id).
- **match_results**: kết quả matching (cv_id, job_id, score, metadata, timestamps).
- **applications**: đơn ứng tuyển (cv_id, job_id, status, timestamps).

## API chính
- `POST /api/matching/job/{job_id}/run`
- `POST /api/matching/cv/{cv_id}/run`
- `GET  /api/matching/job/{job_id}/matches`
- `GET  /api/matching/cv/{cv_id}/matches`

## Dữ liệu lưu trữ
### MongoDB
- **User**: thông tin tài khoản và vai trò
- **CV**: title, location, experience, skills, summary, full_text, pdf_url
- **JD**: title, role, location, job_type, experience_level, skills, salary
- **MatchResult**: cv_id, job_id, score, metadata, timestamps

### ChromaDB
- Lưu embeddings cho truy hồi nhanh (full_text và field-level).

## Công nghệ chính
- Backend: FastAPI, Uvicorn, MongoDB (Beanie/Motor)
- AI/RAG: Gemini API, SentenceTransformers (MiniLM), ChromaDB
- OCR/Parse: PyMuPDF, pytesseract, docx2txt, langdetect
- Frontend: React + Vite + TypeScript + Tailwind + Radix UI

## Cấu trúc thư mục
```
app/
  server/       # FastAPI + RAG pipeline
  client/       # React UI
```

## Cấu hình môi trường
Tạo file `.env` trong `app/server`:
```
GEMINI_API_KEY=your_api_key_here
OPENAI_API_KEY=
MASTODON_API_BASE_URL=
MASTODON_ACCESS_TOKEN=
```

## Chạy hệ thống
### Backend
```
cd app/server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Backend chạy ở `http://localhost:8000`.

### Frontend
```
cd app/client
npm install
npm run dev
```
Frontend chạy ở `http://localhost:5173`.

## Ghi chú
- ChromaDB lưu local tại `app/server/ragmodel/vector_store`.
- MongoDB mặc định: `mongodb://localhost:27017`, DB `job_matching`.
- Nếu chỉ cần chi tiết pipeline AI, xem `app/server/README.md`.