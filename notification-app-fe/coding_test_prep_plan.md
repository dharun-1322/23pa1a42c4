# Afford Medical Technologies — Coding Test Prep Plan
**Track: Backend (Flask) | Time available: 6-8 hours | Test: Tomorrow**

---

## How to use this document
Study and PRACTICE everything below tonight. Tomorrow during the test, no internet/LLM is allowed — so the goal is to get your hands so used to the syntax that you don't need to look anything up. Type every code example yourself at least once. Don't just read it.

**Time allocation (for an 8-hour window):**
| Block | Time | Topic |
|---|---|---|
| 1 | 2.5 hrs | Flask from scratch + REST API |
| 2 | 1 hr | Git commands (hands-on) |
| 3 | 1.5 hrs | OOP in Python (hands-on) |
| 4 | 2 hrs | DSA refresh (timed problems) |
| 5 | 1 hr | Full mock: build one small CRUD API end-to-end, push to GitHub |

If you only have 6 hours, compress Block 4 to 1 hour and skip re-deriving things you already know well (e.g. Sliding Window, Kadane's — you have notes on these already).

---

## BLOCK 1: Flask Basics → REST API (2.5 hrs)

### 1.1 Setup
```bash
pip install flask
```
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Server is running"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```
Run with `python app.py`. Test in browser or Postman at `http://127.0.0.1:5000/`.

### 1.2 Routes & HTTP methods (the core of any REST question)
```python
# In-memory "database" — a list of dicts. No real DB needed for most test questions.
students = [
    {"id": 1, "name": "Madhu", "branch": "AI&ML"}
]

# GET all
@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students), 200

# GET one by id
@app.route('/students/<int:id>', methods=['GET'])
def get_student(id):
    student = next((s for s in students if s["id"] == id), None)
    if student is None:
        return jsonify({"error": "Not found"}), 404
    return jsonify(student), 200

# POST — create new
@app.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
    new_id = students[-1]["id"] + 1 if students else 1
    new_student = {"id": new_id, "name": data["name"], "branch": data["branch"]}
    students.append(new_student)
    return jsonify(new_student), 201

# PUT — update existing
@app.route('/students/<int:id>', methods=['PUT'])
def update_student(id):
    student = next((s for s in students if s["id"] == id), None)
    if student is None:
        return jsonify({"error": "Not found"}), 404
    data = request.get_json()
    student.update(data)
    return jsonify(student), 200

# DELETE
@app.route('/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    global students
    students = [s for s in students if s["id"] != id]
    return jsonify({"message": "Deleted"}), 200
```

**Memorize these status codes** (very commonly checked):
- `200` OK (successful GET/PUT/DELETE)
- `201` Created (successful POST)
- `400` Bad Request (validation failure)
- `404` Not Found
- `500` Server Error

### 1.3 Things examiners commonly add — practice these too
- **Query parameters**: `request.args.get('name')` → handles `/students?branch=AI&ML`
- **Path + body validation**: check required fields exist in `request.get_json()`, else return 400
- **Error handling pattern**:
```python
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404
```
- **Filtering/searching a list** — combine with your DSA skills (loop + condition):
```python
@app.route('/students/search', methods=['GET'])
def search_students():
    branch = request.args.get('branch')
    result = [s for s in students if s.get("branch") == branch]
    return jsonify(result), 200
```

### 1.4 If they ask for a database (SQLite) — minimal version
You used SQLite in AttriSense, so this should feel familiar:
```python
import sqlite3

def get_db():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

# One-time setup
conn = get_db()
conn.execute('CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, branch TEXT)')
conn.commit()
conn.close()
```
Don't over-invest here — in-memory list/dict storage is usually acceptable unless the question explicitly demands persistence.

### 1.5 Self-test (do this without looking at your notes)
Build a Flask API for a "Books" resource with GET (all + by id), POST, PUT, DELETE. Give yourself 25 minutes. If you finish without checking back, you're ready.

---

## BLOCK 2: Git Commands — Hands-on (1 hr)

Don't just read these — open a terminal and actually run them in a dummy folder.

### 2.1 Core flow (this is what you'll do tomorrow)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<username>/<roll-number>.git
git push -u origin main
```

### 2.2 .gitignore — must do BEFORE first commit
Create a file named `.gitignore` in your repo root:
```
node_modules/
.DS_Store
__pycache__/
*.pyc
venv/
.env
```

### 2.3 Useful commands you should know cold
```bash
git status                 # see what's changed
git add <file>              # stage a specific file
git add .                    # stage everything
git commit -m "message"      # commit staged changes
git log --oneline            # see commit history
git diff                     # see unstaged changes
git push                     # push to remote
git pull                     # pull latest from remote
```

### 2.4 Folder structure reminder for submission
```
<roll-number>/
├── .gitignore
├── question-1-backend-api/
│   └── app.py
├── question-2-dsa/
│   └── solution.py
```
Everything in **one branch, one repo** — folder per question. Don't create separate repos or branches per question.

### 2.5 If push fails on auth (PAT)
You already know this from your car damage project — when prompted for password, use your **Personal Access Token**, not your GitHub password.

---

## BLOCK 3: OOP Concepts in Python — Hands-on (1.5 hrs)

These are commonly tested by asking you to design a small class-based system (e.g. "model a Library system" or "model an Employee hierarchy").

### 3.1 The four pillars — know definition AND code for each

**Encapsulation** — bundling data + methods, controlling access
```python
class Account:
    def __init__(self, balance):
        self.__balance = balance  # private (double underscore)

    def deposit(self, amount):
        self.__balance += amount

    def get_balance(self):
        return self.__balance
```

**Abstraction** — hiding implementation details, exposing only essentials
```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    def area(self):
        return 3.14159 * self.radius ** 2
```

**Inheritance** — reusing/extending behavior from a parent class
```python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} barks"
```

**Polymorphism** — same method name, different behavior per class
```python
animals = [Dog("Rex"), Animal("Generic")]
for a in animals:
    print(a.speak())  # calls the right version automatically
```

### 3.2 Other things commonly asked
- **Constructor (`__init__`)** and **`self`** — make sure you can explain why `self` is needed
- **Class variable vs instance variable**
```python
class Counter:
    total = 0  # class variable — shared across all instances
    def __init__(self):
        Counter.total += 1
        self.id = Counter.total  # instance variable — unique per object
```
- **`super()`** to call parent constructor:
```python
class Employee(Animal):
    def __init__(self, name, salary):
        super().__init__(name)
        self.salary = salary
```
- **Method overriding vs overloading** (Python doesn't support true overloading — know how to explain this if asked)
- **`@staticmethod` vs `@classmethod` vs instance method** — at least recognize the syntax

### 3.3 Self-test
Model a "Library" system: `Book` class, `Member` class, `Library` class that can add books, issue books, return books. Use inheritance if a "ReferenceBook" can't be issued. Try this cold, 20 minutes.

---

## BLOCK 4: DSA Refresh — Timed Problems (2 hrs)

You already have strong notes here — this is about speed and accuracy under pressure, not relearning from zero.

### 4.1 Quick refresh checklist (don't relearn, just recall the pattern in 5 min each)
- **Two Pointer** — sorted array, pair sum problems
- **Sliding Window** — max/min subarray of size k, longest substring problems
- **Prefix Sum** — range sum queries, subarray sum equals k
- **Kadane's Algorithm** — max subarray sum

### 4.2 Do these (or similar) untimed first, then timed
1. Two Sum (array, hashmap) — 15 min
2. Maximum subarray sum (Kadane's) — 15 min
3. Longest substring without repeating characters (sliding window) — 20 min
4. Move zeroes to end of array (two pointer) — 15 min
5. Subarray sum equals K (prefix sum + hashmap) — 20 min

### 4.3 Don't forget basic string/array problem-solving since "Problem Solving" is explicitly named in the test scope
- Reverse a string/array in-place
- Check palindrome
- Frequency count using a dictionary
- Basic recursion (factorial, Fibonacci) — just in case OOP/DSA overlaps

---

## BLOCK 5: Final Mock Run (1 hr) — Do this last

Simulate the real test in miniature:
1. Create a folder `test-mock/question-1-backend-api/`
2. Build a small Flask CRUD API from memory, no notes — 30 min
3. Initialize git, write `.gitignore`, commit, push to a throwaway GitHub repo — 15 min
4. Review: did you remember status codes, route methods, and the git flow without looking anything up? — 15 min

If this mock run goes smoothly, you are ready for tomorrow.

---

## Night-before checklist
- [ ] VS Code installed and opens without issues
- [ ] Postman or Insomnia installed
- [ ] Python + Flask installed and verified (`python -m flask --version`)
- [ ] Git installed, GitHub login/PAT ready
- [ ] Get sleep — better to walk in fresh than to cram until 3 AM

You've already cleared GitHub-based shortlisting and this is your second shortlist this season — your fundamentals are solid. This is about sharpening recall under no-internet conditions, not learning something you're incapable of. Good luck, Madhu.
