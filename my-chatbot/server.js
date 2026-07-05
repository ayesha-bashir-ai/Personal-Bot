import express from 'express'

const app = express()
app.use(express.json())

const RESUME_SECTIONS = {
  intro: `Ayesha Bashir is an AI/ML engineer with hands-on experience building and training computer vision and NLP systems using Python and deep learning tools. She has developed a YOLOv8 object detection pipeline, built FastAPI endpoints for model inference, and combines practical ML applications with backend engineering.`,
  education: `B.Sc. Computer Science (BSCS) from Superior University, Lahore (2016–2020). Relevant coursework includes Machine Learning, Image Processing, Database Systems, Software Engineering, and Pattern Recognition.`,
  skills: `Technical skills include Python, JavaScript, PHP, Node.js, YOLOv8, scikit-learn, NLTK, OpenCV, PyTorch, HuggingFace Transformers, NumPy, Pandas, Matplotlib, Seaborn, FastAPI, Django, PostgreSQL, SQL, REST API design, HTML, CSS, Bootstrap, and responsive web development.`,
  projects: `Key projects include a YOLOv8 object detection system with custom annotation and FastAPI deployment, a Jarvis AI assistant with structured intent handling, a sentiment analysis pipeline using TF-IDF and scikit-learn, an e-commerce web application with PHP and PostgreSQL, an interactive quiz chatbot, and an ALPR license plate recognition system using OpenCV and OCR.`,
  experience: `Professional experience spans freelance academic content writing, corporate liaison coordination at HospitAll – Netsol Technologies, and online instruction in CS & IT. Ayesha has developed communication, project coordination, technical documentation, and client-focused delivery skills.`,
  certifications: `Certifications include Microsoft Certified: Azure AI Fundamentals (earned June 2026), Artificial Intelligence (2026), Freelancing (DigiSkills 2022), and Digital Marketing (DigiSkills 2022).`,
  hobbies: `Ayesha participates in AI workshops, technology learning programs, teaches students online, and engages with practical AI projects. She also focuses on continuous learning, research, and technical skill growth.`,
  contact: `Contact details: +92-306-9623910, ayesha104bashir@gmail.com, LinkedIn: linkedin.com/in/ayesha-bashir-b0b976234, GitHub: github.com/ayesha-bashir-ai.`,
}

const SECTION_KEYWORDS = [
  { key: 'intro', terms: ['summary', 'professional summary', 'intro', 'about', 'background'] },
  { key: 'education', terms: ['education', 'academic', 'degree', 'university', 'coursework'] },
  { key: 'skills', terms: ['skill', 'skills', 'technology', 'technical', 'framework'] },
  { key: 'projects', terms: ['project', 'projects', 'portfolio', 'work examples', 'experience project'] },
  { key: 'experience', terms: ['experience', 'work', 'profession', 'role', 'employment'] },
  { key: 'certifications', terms: ['certif', 'certificate', 'certification', 'course'] },
  { key: 'hobbies', terms: ['hobby', 'extracurricular', 'interest', 'membership', 'research', 'workshop'] },
  { key: 'contact', terms: ['contact', 'email', 'phone', 'linkedin', 'github', 'reach'] },
]

function getReply(question) {
  const q = (question || '').toLowerCase()
  for (const section of SECTION_KEYWORDS) {
    if (section.terms.some((term) => q.includes(term))) {
      return RESUME_SECTIONS[section.key]
    }
  }

  return `Thanks for asking about Ayesha. I can answer questions about her intro, education, skills, projects, experience, certifications, hobbies, or contact details.`
}

app.post('/api/chat', (req, res) => {
  const question = req.body?.question || ''
  res.json({ reply: getReply(question) })
})

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})
