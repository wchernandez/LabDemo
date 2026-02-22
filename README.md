```markdown
# 🚀 AutoTA - AI Teaching Assistant for CS Labs

**From 2-hour error hell → 3-second debug hints for CS students**

## 🎯 The Problem

CS students lose **2-6 hours/week** on cryptic errors:

```
IndexOutOfRangeException was unhandled
Uncaught TypeError: Cannot read property '0' of undefined
```

TAs can't scale to everyone. StackOverflow teaches copying, not debugging skills.

## 🪄 The Solution

**Paste 3 things → instant ethical hints (no cheating):**
```
🔴 What broke: Loop went past array end (plain English)
💡 Core concept: Array indexing starts at 0
🧭 Debug nudge: Check i <= vs i < loop condition
```

## 📱 Live Examples (7 languages)

| Language | Common Error | AutoTA Fix |
|----------|--------------|------------|
| **C#** | `IndexOutOfRangeException` | Array bounds exclusive |
| **Python** | `IndexError: list index out of range` | Lists start at index 0 |
| **Java** | `ArrayIndexOutOfBoundsException` | For-loop upper bounds |
| **JavaScript** | `Cannot read property of undefined` | Null checking |
| **C++** | Segmentation fault | Pointer arithmetic |
| **C** | Buffer overflow | Array bounds |
| **SQL** | `Unknown column` | JOIN syntax |

## 🛠️ Tech Stack
```
Frontend: Next.js 15 + Tailwind CSS + shadcn/ui
AI: Groq + Llama 3.1 70B (300+ tokens/sec)
Syntax: react-syntax-highlighter (7 languages)
Deploy: Vercel (global CDN, auto-SSL)
```

## 🚀 Run Locally (2 minutes)
```bash
git clone https://github.com/wchernandez/autota.git
cd autota
# Get free key: console.groq.com
echo "GROQ_API_KEY=your_key_here" > .env.local
npm install
npm run dev
# Open localhost:3000
```

## 🌍 Future Roadmap
- [ ] Chrome/VSCode extension
- [ ] Course-specific hint librariesverc
- [ ] Multi-file project analysis
- [ ] Mobile app

## 🎖️ Built For
**CraterHacks 2026** - Teams of 1-4 students

**William Hernandez**  
Software Engineering Student  
University of Waikato, NZ  
[https://github.com/wchernandez]

---

**⭐ Star if this would save your next lab session!**
```

## Quick setup:
```bash
# Create file
touch README.md
# Paste above content
# Replace: YOUR_YOUTUBE_ID, Vercel URL, GitHub username
git add README.md
git commit -m "Add CraterHacks README"
git push
```