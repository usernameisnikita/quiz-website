let quiz = {
    title: "",
    questions: []
  };
  
  function addQuestion(type) {
    const container = document.getElementById("questionsContainer");
    const index = quiz.questions.length;
  
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
  
    let html = `<input type="text" id="q${index}" placeholder="Question text..." />`;
  
    if (type === "mcq") {
      html += `
        <div>
          <input type="text" placeholder="Option 1" id="q${index}o0" />
          <input type="text" placeholder="Option 2" id="q${index}o1" />
          <input type="text" placeholder="Option 3" id="q${index}o2" />
          <input type="text" placeholder="Option 4" id="q${index}o3" />
        </div>
        <input type="number" placeholder="Correct option number (1-4)" id="q${index}correct" min="1" max="4" />
      `;
    } else if (type === "truefalse") {
      html += `
        <select id="q${index}correct">
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      `;
    } else if (type === "short") {
      html += `<input type="text" placeholder="Correct answer" id="q${index}correct" />`;
    } else if (type === "poll") {
      html += `
        <div>
          <input type="text" placeholder="Option 1" id="q${index}o0" />
          <input type="text" placeholder="Option 2" id="q${index}o1" />
          <input type="text" placeholder="Option 3" id="q${index}o2" />
          <input type="text" placeholder="Option 4" id="q${index}o3" />
        </div>
        <small>Note: Polls don't have a correct answer.</small>
      `;
    }
  
    html += `<input type="hidden" id="q${index}type" value="${type}" />`;
  
    questionDiv.innerHTML = html;
    container.appendChild(questionDiv);
  }
  
  function startQuiz() {
    const titleInput = document.getElementById("quizTitle").value;
    const qDivs = document.querySelectorAll(".question");
  
    if (!titleInput || qDivs.length === 0) {
      alert("Please enter a title and at least one question!");
      return;
    }
  
    quiz.title = titleInput;
    quiz.questions = [];
  
    qDivs.forEach((div, i) => {
      const type = document.getElementById(`q${i}type`).value;
      const text = document.getElementById(`q${i}`).value;
  
      let question = { type, text };
  
      if (type === "mcq" || type === "poll") {
        question.options = [
          document.getElementById(`q${i}o0`).value,
          document.getElementById(`q${i}o1`).value,
          document.getElementById(`q${i}o2`).value,
          document.getElementById(`q${i}o3`).value,
        ];
      }
  
      if (type === "mcq") {
        question.correct = parseInt(document.getElementById(`q${i}correct`).value) - 1;
      } else if (type === "truefalse") {
        question.correct = document.getElementById(`q${i}correct`).value === "true";
      } else if (type === "short") {
        question.correct = document.getElementById(`q${i}correct`).value.trim().toLowerCase();
      }
  
      quiz.questions.push(question);
    });
  
    document.querySelector(".main-container").classList.add("hidden");
    document.querySelector(".quiz-area").classList.remove("hidden");
    renderQuiz();
  }
  
  function renderQuiz() {
    document.getElementById("displayTitle").innerText = quiz.title;
    const quizDiv = document.getElementById("quizQuestions");
    quizDiv.innerHTML = "";
  
    quiz.questions.forEach((q, i) => {
      const qEl = document.createElement("div");
      qEl.classList.add("question");
      qEl.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.text}</p>`;
  
      if (q.type === "mcq" || q.type === "poll") {
        q.options.forEach((opt, j) => {
          qEl.innerHTML += `
            <div class="option">
              <label><input type="radio" name="q${i}" value="${j}" /> ${opt}</label>
            </div>
          `;
        });
      } else if (q.type === "truefalse") {
        qEl.innerHTML += `
          <label><input type="radio" name="q${i}" value="true" /> True</label>
          <label><input type="radio" name="q${i}" value="false" /> False</label>
        `;
      } else if (q.type === "short") {
        qEl.innerHTML += `<input type="text" id="short${i}" placeholder="Your answer..." />`;
      }
  
      quizDiv.appendChild(qEl);
    });
  }
  
  function submitQuiz() {
    let score = 0;
  
    quiz.questions.forEach((q, i) => {
      let correct = false;
  
      if (q.type === "mcq") {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) correct = true;
      } else if (q.type === "truefalse") {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.correct.toString()) correct = true;
      } else if (q.type === "short") {
        const input = document.getElementById(`short${i}`).value.trim().toLowerCase();
        if (input === q.correct) correct = true;
      } else if (q.type === "poll") {
        correct = true; // always correct for polls
      }
  
      if (correct) score++;
    });
  
    alert(`🎉 You scored ${score} out of ${quiz.questions.length}`);
  }
  