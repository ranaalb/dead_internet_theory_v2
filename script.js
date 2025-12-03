// Select dots and sections
const dots = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('.section');
const container = document.querySelector('.container');

// Tooltip placement helper: clamps tooltip so it doesn't go off-screen
function positionTooltip(selection, pageX, pageY, offsetX = 15, offsetY = 15) {
  try {
    const node = selection.node();
    if (!node) return;

    // ensure it's visible so measurements work
    // we don't change visibility here; caller should ensure content is set and visible
    const rectW = node.offsetWidth || 220;
    const rectH = node.offsetHeight || 80;

    let left = pageX + offsetX;
    if (left + rectW + 10 > window.innerWidth) {
      left = pageX - rectW - offsetX;
    }

    let top = pageY - rectH - offsetY;
    if (top < 8) {
      top = pageY + offsetY;
    }

    selection.style('left', left + 'px').style('top', top + 'px');
  } catch (e) {
    // silently fail if measurement isn't possible
  }
}

// Track if chat animation has been triggered
let chatAnimationTriggered = false;

// Intersection Observer for detecting which section is visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        // Remove active from all dots first
        dots.forEach((dot) => dot.classList.remove('active'));
        // Add active to the matching dot
        const activeDot = document.querySelector(`.dot[href="#${id}"]`);
        if (activeDot) {
          activeDot.classList.add('active');
        }

        // Trigger chat animation when section3 comes into view
        if (id === 'section3' && !chatAnimationTriggered) {
          chatAnimationTriggered = true;
          const messages = document.querySelectorAll('.message-container');
          messages.forEach((msg) => {
            msg.classList.add('animate');
          });
        }
      }
    });
  },
  { 
    root: container,
    threshold: 0.6  // Simplified - removed rootMargin
  }
);

// Observe each section
sections.forEach((section) => {
  observer.observe(section);
});

// Smooth scroll when clicking dots
dots.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = dot.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Game Data - Bot vs Human Detection Game (Using actual database content)
const gameData = [
  {
    id: 1,
    title: "",
    content: "In countries where coronaviruses cause disease, there is increasing support for putting an end to the use of experimental antiviral drugs. Some specialist groups fear that this will mean a shift in guidelines that could be catastrophic for those on the frontline. As a result, they are asking the public to step up and show their concerns in a public petition.",
    isBot: true,
    username: "@HealthNewsDaily",
    avatar: "🩺",
    handle: "healthnewsdaily"
  },
  {
    id: 2,
    title: "",
    content: "Barcelona's Champions League last-16 second leg match with Napoli, scheduled for 18 March, will take place without spectators due to fears over the spread of the coronavirus, a club spokesman said on Tuesday. The match will take place at Camp Nou after a 1-1 draw in Naples.",
    isBot: false,
    username: "@SportsReporter",
    avatar: "⚽",
    handle: "sportsreporter"
  },
  {
    id: 3,
    title: "",
    content: "Noonan also went on to argue that AI is more than a buzzword, explaining that 'programs are not neutral; they have effects.' Because of the importance of ethics in AI research, she argued that 'no one ever sat down and wrote a paper' on the topic. It is important to note that Noonan is fully aware that she is the embodiment of what she is not: a hacker.",
    isBot: true,
    username: "@TechEthics",
    avatar: "🤖",
    handle: "techethics"
  },
  {
    id: 4,
    title: "",
    content: "Click over to Google, type in 'coronavirus', and press enter. The results you see will bear little resemblance to any other search. There are no ads, no product recommendations, and no links to websites that have figured out how to win the search engine optimisation game. Government, NGO and mainstream media sources dominate.",
    isBot: false,
    username: "@TechReporter",
    avatar: "💻",
    handle: "techreporter"
  },
  {
    id: 5,
    title: "",
    content: "Although no opening date has been set, Cruise is expected to return to the helm of 'Mission: Impossible' within a year of the release of 'Tomorrowland,' according to NASA. Launching from Kennedy Space Center's pad 39A, Cruise is set to return to the global screen in July, when 'Mission: Impossible III' is scheduled to arrive in theaters.",
    isBot: true,
    username: "@MovieNews",
    avatar: "🎬",
    handle: "movienews"
  },
  {
    id: 6,
    title: "",
    content: "SAN FRANCISCO — Several months ago, Google hired dozens of actors to sit at a table, stand in a hallway and walk down a street while talking into a video camera. Then the company's researchers, using a new kind of artificial intelligence software, swapped the faces of the actors. People who had been walking were suddenly at a table.",
    isBot: false,
    username: "@DigitalNews",
    avatar: "🌐",
    handle: "digitalnews"
  }
];

// Shuffle gameData so questions appear in random order each refresh
// Improved shuffle: avoid simple alternation (e.g., human, ai, human, ai)
function betterShuffle(array) {
  // Separate bots and humans
  const bots = array.filter(q => q.isBot);
  const humans = array.filter(q => !q.isBot);

  // Shuffle each group independently
  for (let i = bots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bots[i], bots[j]] = [bots[j], bots[i]];
  }
  for (let i = humans.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [humans[i], humans[j]] = [humans[j], humans[i]];
  }

  // Merge with random chunk sizes to avoid strict alternation
  let result = [];
  let botIdx = 0, humanIdx = 0;
  while (botIdx < bots.length || humanIdx < humans.length) {
    // Randomly decide how many to take from each group (1 or 2)
    if (botIdx < bots.length && Math.random() < 0.5) {
      const take = Math.min(bots.length - botIdx, Math.random() < 0.7 ? 1 : 2);
      result = result.concat(bots.slice(botIdx, botIdx + take));
      botIdx += take;
    }
    if (humanIdx < humans.length) {
      const take = Math.min(humans.length - humanIdx, Math.random() < 0.7 ? 1 : 2);
      result = result.concat(humans.slice(humanIdx, humanIdx + take));
      humanIdx += take;
    }
  }
  // If bots or humans left, add them
  if (botIdx < bots.length) result = result.concat(bots.slice(botIdx));
  if (humanIdx < humans.length) result = result.concat(humans.slice(humanIdx));

  // Copy back to original array
  for (let i = 0; i < array.length; i++) {
    array[i] = result[i];
  }
}
betterShuffle(gameData);

// Game State
let currentQuestion = 0;
let score = 0;
let gameStarted = false;

// Game Elements
const tweetCard = document.getElementById('tweetCard');
const tweetTitle = document.getElementById('tweetTitle');
const tweetText = document.getElementById('tweetText');
const tweetUsername = document.getElementById('tweetUsername');
const tweetAvatar = document.getElementById('tweetAvatar');
const tweetTime = document.getElementById('tweetTime');
const humanBtn = document.getElementById('humanBtn');
const botBtn = document.getElementById('botBtn');
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const currentEl = document.getElementById('current');
const totalQuestionsEl = document.getElementById('totalQuestions');
const finalResults = document.getElementById('finalResults');
const finalScore = document.getElementById('finalScore');
const finalTotal = document.getElementById('finalTotal');
const finalMessage = document.getElementById('finalMessage');
const restartBtn = document.getElementById('restartBtn');
const commentsEl = document.getElementById('comments');
const retweetsEl = document.getElementById('retweets');
const likesEl = document.getElementById('likes');

// Initialize game
function initGame() {
  currentQuestion = 0;
  score = 0;
  gameStarted = true;
  finalResults.style.display = 'none';
  updateScore();
  loadQuestion();
}

// Update score display
function updateScore() {
  console.log('updateScore called — score=', score, 'currentQuestion=', currentQuestion);

  if (scoreEl) {
    try { scoreEl.textContent = score; } catch (e) { console.warn('Failed to update scoreEl textContent', e); }
  } else {
    console.warn('scoreEl is null — cannot update visible score');
  }

  if (totalEl) totalEl.textContent = gameData.length;
  if (currentEl) currentEl.textContent = currentQuestion + 1;
  if (totalQuestionsEl) totalQuestionsEl.textContent = gameData.length;
  // Ensure the accessible label on the score display is up to date
  try {
    const sd = document.querySelector('.score-display');
    if (sd) sd.setAttribute('aria-label', `Score ${score} of ${gameData.length}`);
  } catch (e) {
    // no-op if DOM isn't ready
  }
}


// Generate random social media stats
function generateStats() {
  const comments = Math.floor(Math.random() * 100) + 5;
  const retweets = Math.floor(Math.random() * 200) + 10;
  const likes = Math.floor(Math.random() * 1000) + 50;
  
  commentsEl.textContent = comments;
  retweetsEl.textContent = retweets;
  likesEl.textContent = likes;
}

// Load current question
function loadQuestion() {
  if (currentQuestion >= gameData.length) {
    endGame();
    return;
  }

  const question = gameData[currentQuestion];
  
  tweetTitle.textContent = question.title;
  tweetText.textContent = question.content;
  tweetUsername.textContent = question.username;
  tweetAvatar.textContent = question.avatar;
  
  // Random time
  const times = ['2m', '5m', '12m', '1h', '2h', '4h'];
  tweetTime.textContent = times[Math.floor(Math.random() * times.length)];
  
  generateStats();
  
  // Reset buttons
  humanBtn.disabled = false;
  botBtn.disabled = false;
  humanBtn.style.opacity = '1';
  botBtn.style.opacity = '1';
  
  feedback.textContent = '';
  feedback.className = 'feedback';
  
  updateScore();
}

// Handle answer
function handleAnswer(isBot) {
  console.log('handleAnswer called — isBot=', isBot, 'currentQuestion=', currentQuestion, 'score(before)=', score);
  const correct = gameData[currentQuestion].isBot === isBot;
  
  if (correct) {
    score++;
    console.log('Correct answer — score now', score);
    feedback.textContent = '✅ Correct!';
    feedback.className = 'feedback correct';
  } else {
    const actualType = gameData[currentQuestion].isBot ? 'AI Generated' : 'Human Written';
    feedback.textContent = `❌ Wrong! This was ${actualType}`;
    feedback.className = 'feedback incorrect';
  }
  
  // Disable buttons
  humanBtn.disabled = true;
  botBtn.disabled = true;
  humanBtn.style.opacity = '0.5';
  botBtn.style.opacity = '0.5';
  
  updateScore();
  
  // Move to next question after delay
  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 2000);
}

// End game
function endGame() {
  finalScore.textContent = score;
  finalTotal.textContent = gameData.length;
  
  const percentage = (score / gameData.length) * 100;
  let message = '';
  
  if (percentage >= 80) {
    message = 'Excellent! You have great digital literacy skills!';
  } else if (percentage >= 60) {
    message = 'Good job! You can spot most fake content.';
  } else if (percentage >= 40) {
    message = 'Not bad, but there\'s room for improvement in detecting AI content.';
  } else {
    message = 'Keep practicing! AI detection is tricky but learnable.';
  }
  
  finalMessage.textContent = message;
  finalResults.style.display = 'block';
  tweetCard.style.display = 'none';
  document.querySelector('.game-buttons').style.display = 'none';
  document.querySelector('.game-question').style.display = 'none';
}

// Event listeners
if (humanBtn && botBtn) {
  humanBtn.addEventListener('click', () => handleAnswer(false));
  botBtn.addEventListener('click', () => handleAnswer(true));
}

if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    tweetCard.style.display = 'block';
    document.querySelector('.game-buttons').style.display = 'flex';
    document.querySelector('.game-question').style.display = 'block';
    initGame();
  });
}

// Start game when section 6 comes into view
const gameObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id === 'section6' && !gameStarted) {
        initGame();
      }
    });
  },
  { 
    threshold: 0.3
  }
);

const section6 = document.getElementById('section6');
if (section6) {
  gameObserver.observe(section6);
}

// ========== BOT PREDICTION INTERACTIVE ==========
document.addEventListener('DOMContentLoaded', () => {
  const tweetGrid = document.getElementById('tweetGrid');
  const selectedCount = document.getElementById('selectedCount');
  const submitBtn = document.getElementById('submitPrediction');
  const feedback = document.getElementById('predictionFeedback');
  
  if (!tweetGrid || !selectedCount || !submitBtn) {
    console.warn('Bot prediction elements not found');
    return;
  }

  const ACTUAL_BOT_COUNT = 3; // From TruthSeeker dataset (3.2%)
  let tweets = [];
  let isDragging = false;
  let dragMode = null; // 'select' or 'deselect'

  // Sample tweet texts for variety
  const tweetTexts = [
    "Just had the best coffee ☕",
    "Check out this amazing deal!",
    "Happy Monday everyone!",
    "Can't believe this happened 😮",
    "Follow for more content 🔥",
    "New post coming soon!",
    "What do you think about this?",
    "This is incredible! 🎉",
    "Don't miss out on this...",
    "Sharing some thoughts today",
    "Great day to be alive! ✨",
    "Join our community now!",
    "Wow, just wow 😍",
    "Link in bio for more info",
    "This changed my life 💯"
  ];

  // Create 100 tweet cards
  function initializeTweets() {
    tweetGrid.innerHTML = '';
    tweets = [];
    
    // Create array with 3 bots and 97 humans (shuffled)
    for (let i = 0; i < 100; i++) {
      tweets.push({
        type: i < ACTUAL_BOT_COUNT ? 'bot' : 'human',
        selected: false,
        text: tweetTexts[Math.floor(Math.random() * tweetTexts.length)]
      });
    }
    
    // Shuffle array
    tweets.sort(() => Math.random() - 0.5);
    
    // Create tweet cards
    tweets.forEach((tweet, index) => {
      const tweetCard = document.createElement('div');
      tweetCard.className = 'tweet-card';
      tweetCard.dataset.index = index;
      tweetCard.dataset.type = tweet.type;
      
      tweetCard.innerHTML = `
        <div class="tweet-pfp">👤</div>
        <div class="tweet-content">
          <div class="tweet-username">@user${String(index + 1).padStart(3, '0')}</div>
          <div class="tweet-text">${tweet.text}</div>
        </div>
      `;
      
      // Click to toggle selection
      tweetCard.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (submitBtn.disabled) return;
        
        isDragging = true;
        const isSelected = tweetCard.classList.contains('selected');
        dragMode = isSelected ? 'deselect' : 'select';
        toggleSelection(tweetCard);
      });

      // Drag over to select/deselect
      tweetCard.addEventListener('mouseenter', () => {
        if (isDragging && !submitBtn.disabled) {
          if (dragMode === 'select' && !tweetCard.classList.contains('selected')) {
            toggleSelection(tweetCard);
          } else if (dragMode === 'deselect' && tweetCard.classList.contains('selected')) {
            toggleSelection(tweetCard);
          }
        }
      });
      
      tweetGrid.appendChild(tweetCard);
    });
  }

  // Toggle tweet selection
  function toggleSelection(tweetCard) {
    const index = parseInt(tweetCard.dataset.index);
    const isSelected = tweetCard.classList.contains('selected');
    
    if (isSelected) {
      tweetCard.classList.remove('selected');
      tweetCard.querySelector('.tweet-pfp').textContent = '👤';
      tweets[index].selected = false;
    } else {
      tweetCard.classList.add('selected');
      tweetCard.querySelector('.tweet-pfp').textContent = '🤖';
      tweets[index].selected = true;
    }
    
    updateCount();
  }

  // Update selected count
  function updateCount() {
    const count = tweets.filter(t => t.selected).length;
    selectedCount.textContent = count;
  }

  // Stop dragging
  document.addEventListener('mouseup', () => {
    isDragging = false;
    dragMode = null;
  });

  // Prevent text selection while dragging
  tweetGrid.addEventListener('selectstart', (e) => {
    if (isDragging) e.preventDefault();
  });

  // Submit prediction
  submitBtn.addEventListener('click', () => {
    const userPrediction = tweets.filter(t => t.selected).length;
    
    if (userPrediction === 0) {
      alert('Please select some tweets that you think are from bots!');
      return;
    }

    // Show scroll prompt
    const scrollPrompt = document.getElementById('scrollPrompt');
    scrollPrompt.style.display = 'block';

    // Disable button after submission
    submitBtn.disabled = true;

    // Store the user prediction and selected indices for the next section
    window.userBotPrediction = userPrediction;
    window.userSelectedIndices = tweets.map((t, idx) => t.selected ? idx : -1).filter(idx => idx !== -1);

    // Notify any listeners (e.g., the reveal visualization) that a prediction was submitted
    document.dispatchEvent(new CustomEvent('userPredictionSubmitted', { detail: { prediction: userPrediction } }));
  });

  // Initialize the tweets
  initializeTweets();
});

// ========== BOT REVEAL VISUALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const revealViz = d3.select("#botRevealViz");
  const userPredictionDisplay = document.getElementById('userPredictionDisplay');
  
  if (revealViz.empty()) {
    console.warn('No #botRevealViz element found');
    return;
  }

  // Observer to trigger animation when section comes into view
  const revealSection = document.getElementById('sectionBotReveal');
  
  // Listen for prediction submission
  document.addEventListener('userPredictionSubmitted', (e) => {
    if (userPredictionDisplay) {
      userPredictionDisplay.textContent = e.detail.prediction;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Update user prediction
        if (window.userBotPrediction !== undefined) {
          userPredictionDisplay.textContent = window.userBotPrediction;
        }
        
        // Create visualization
        createBotRevealVisualization();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  if (revealSection) {
    observer.observe(revealSection);
  }

  function createBotRevealVisualization() {
    // Clear any existing visualization
    revealViz.html('');
    
    // Create grid container
    const gridContainer = revealViz
      .append('div')
      .attr('class', 'reveal-grid');

    // Create array of 100 items: 3 bots, 97 humans
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: i,
        isBot: i < 3 // First 3 are bots
      });
    }

    // Shuffle the array
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    console.log('Total items:', data.length);
    console.log('Bots:', data.filter(d => d.isBot).length);
    console.log('Humans:', data.filter(d => !d.isBot).length);

    // Get user selections
    const userSelections = window.userSelectedIndices || [];

    // Create reveal cards
    data.forEach((item, index) => {
      const wasSelected = userSelections.includes(index);
      const card = gridContainer
        .append('div')
        .attr('class', `reveal-card ${item.isBot ? 'reveal-bot' : 'reveal-human'} ${wasSelected ? 'user-selected' : ''}`)
        .style('opacity', 0)
        .html(`<div class="reveal-pfp">👤</div>`);
      
      // Animate entrance
      setTimeout(() => {
        card.style('opacity', 1);
      }, index * 10);
    });

    // Pulse bot cards after animation completes
    setTimeout(() => {
      gridContainer.selectAll('.reveal-bot')
        .classed('pulse-bot', true);
    }, 1500);
  }
});

// ========== FACEBOOK FAKE ACCOUNTS CHART ==========
document.addEventListener('DOMContentLoaded', () => {
  const facebookDiv = d3.select("#facebook-chart");
  
  if (facebookDiv.empty()) {
    console.warn('No #facebook-chart element found; skipping chart');
    return;
  }

  // Data from Facebook transparency reports (fake accounts removed in millions)
  const data = [
    { quarter: "Q4 2017", value: 694, label: "694" },
    { quarter: "Q1 2018", value: 583, label: "583" },
    { quarter: "Q2 2018", value: 800, label: "800" },
    { quarter: "Q3 2018", value: 754, label: "754" },
    { quarter: "Q4 2018", value: 1200, label: "1,200" },
    { quarter: "Q1 2019", value: 2200, label: "2,200" },
    { quarter: "Q2 2019", value: 1500, label: "1,500" },
    { quarter: "Q3 2019", value: 1700, label: "1,700" },
    { quarter: "Q4 2019", value: 1100, label: "1,100" },
    { quarter: "Q1 2020", value: 1700, label: "1,700" },
    { quarter: "Q2 2020", value: 1500, label: "1,500" },
    { quarter: "Q3 2020", value: 1300, label: "1,300" },
    { quarter: "Q4 2020", value: 1300, label: "1,300" },
    { quarter: "Q1 2021", value: 1300, label: "1,300" },
    { quarter: "Q2 2021", value: 1700, label: "1,700" },
    { quarter: "Q3 2021", value: 1800, label: "1,800" },
    { quarter: "Q4 2021", value: 1700, label: "1,700" },
    { quarter: "Q1 2022", value: 1600, label: "1,600" },
    { quarter: "Q2 2022", value: 1400, label: "1,400" },
    { quarter: "Q3 2022", value: 1500, label: "1,500" },
    { quarter: "Q4 2022", value: 1300, label: "1,300" },
    { quarter: "Q1 2023", value: 426, label: "426" },
    { quarter: "Q2 2023", value: 676, label: "676" },
    { quarter: "Q3 2023", value: 827, label: "827" },
    { quarter: "Q4 2023", value: 691, label: "691" },
    { quarter: "Q1 2024", value: 631, label: "631" },
    { quarter: "Q2 2024", value: 1200, label: "1,200" },
    { quarter: "Q3 2024", value: 1100, label: "1,100" },
    { quarter: "Q4 2024", value: 1400, label: "1,400" },
    { quarter: "Q1 2025", value: 1000, label: "1,000" },
    { quarter: "Q2 2025", value: 687, label: "687" }
  ];

  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = 1000 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = facebookDiv
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.quarter))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height, 0]);

  // Add bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.quarter))
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", "#1877F2")
    .transition()
    .duration(800)
    .delay((d, i) => i * 20)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));

  // Add value labels on top of bars
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.quarter) + x.bandwidth() / 2)
    .attr("y", d => y(d.value) - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#fff")
    .attr("font-weight", "600")
    .attr("opacity", 0)
    .text(d => d.label)
    .transition()
    .duration(500)
    .delay((d, i) => i * 20 + 400)
    .attr("opacity", 1);

  // X Axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .style("fill", "#8899A6")
    .style("font-size", "13px");

  // Y Axis
  svg.append("g")
    .call(d3.axisLeft(y).ticks(6))
    .selectAll("text")
    .style("fill", "#8899A6");

  // Y Axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "#8899A6")
    .style("font-weight", "600")
    .text("Fake Accounts Removed (Millions)");

  // Style axis lines
  svg.selectAll(".domain, .tick line")
    .style("stroke", "#8899A6")
    .style("opacity", 0.3);
});

// ========== GLOBAL INTERNET TRAFFIC CHART ==========

const filters = {
      sophistication: null,
      attackType: null,
      country: null
    };

    const sophisticationColors = {
      'Simple': '#fbbf24',
      'Moderate': '#f59e0b',
      'Advanced': '#ef4444'
    };

    const attackTypeColors = {
      'Scraping': '#60a5fa',
      'Credential Stuffing': '#3b82f6',
      'Scanning': '#2563eb',
      'Carding': '#8b5cf6',
      'Fake Engagement': '#a855f7'
    };

    const rawData = {
      "sophistication": [
        { "class": "Simple", "share": 39.0 },
        { "class": "Moderate", "share": 18.0 },
        { "class": "Advanced", "share": 43.0 }
      ],
      "attackTypes": [
        { "type": "Scraping", "share": 34.0 },
        { "type": "Credential Stuffing", "share": 25.0 },
        { "type": "Scanning", "share": 17.0 },
        { "type": "Carding", "share": 12.0 },
        { "type": "Fake Engagement", "share": 12.0 }
      ],
      "countries": [
        { "country": "United States", "botShare": 32.0 },
        { "country": "Netherlands", "botShare": 12.0 },
        { "country": "Germany", "botShare": 8.0 },
        { "country": "Singapore", "botShare": 7.0 },
        { "country": "UK", "botShare": 6.0 },
        { "country": "Russia", "botShare": 6.0 },
        { "country": "France", "botShare": 5.0 },
        { "country": "Japan", "botShare": 5.0 },
        { "country": "Australia", "botShare": 4.0 },
        { "country": "Brazil", "botShare": 3.0 }
      ],
      "countryToAttackType": [
        { "country": "United States", "scraping": 40, "credential": 25, "scanning": 15, "carding": 10, "fake": 10 },
        { "country": "Netherlands", "scraping": 35, "credential": 30, "scanning": 20, "carding": 10, "fake": 5 },
        { "country": "Germany", "scraping": 32, "credential": 28, "scanning": 20, "carding": 12, "fake": 8 },
        { "country": "Singapore", "scraping": 20, "credential": 45, "scanning": 15, "carding": 10, "fake": 10 },
        { "country": "UK", "scraping": 38, "credential": 22, "scanning": 20, "carding": 10, "fake": 10 },
        { "country": "Russia", "scraping": 30, "credential": 20, "scanning": 35, "carding": 10, "fake": 5 },
        { "country": "France", "scraping": 35, "credential": 25, "scanning": 20, "carding": 10, "fake": 10 },
        { "country": "Japan", "scraping": 28, "credential": 30, "scanning": 22, "carding": 10, "fake": 10 },
        { "country": "Australia", "scraping": 30, "credential": 28, "scanning": 22, "carding": 10, "fake": 10 },
        { "country": "Brazil", "scraping": 33, "credential": 27, "scanning": 20, "carding": 10, "fake": 10 }
      ],

      "hourlyActivity": [
        { "hour": 0, "simple": 30, "moderate": 20, "advanced": 55 },
        { "hour": 1, "simple": 28, "moderate": 19, "advanced": 57 },
        { "hour": 2, "simple": 27, "moderate": 18, "advanced": 60 },
        { "hour": 3, "simple": 25, "moderate": 17, "advanced": 63 },
        { "hour": 4, "simple": 24, "moderate": 17, "advanced": 65 },
        { "hour": 5, "simple": 25, "moderate": 18, "advanced": 62 },
        { "hour": 6, "simple": 28, "moderate": 20, "advanced": 58 },
        { "hour": 7, "simple": 31, "moderate": 22, "advanced": 55 },
        { "hour": 8, "simple": 35, "moderate": 25, "advanced": 52 },
        { "hour": 9, "simple": 40, "moderate": 27, "advanced": 50 },
        { "hour": 10, "simple": 42, "moderate": 28, "advanced": 49 },
        { "hour": 11, "simple": 43, "moderate": 28, "advanced": 49 },
        { "hour": 12, "simple": 44, "moderate": 29, "advanced": 48 },
        { "hour": 13, "simple": 45, "moderate": 30, "advanced": 47 },
        { "hour": 14, "simple": 44, "moderate": 30, "advanced": 48 },
        { "hour": 15, "simple": 42, "moderate": 29, "advanced": 50 },
        { "hour": 16, "simple": 41, "moderate": 28, "advanced": 52 },
        { "hour": 17, "simple": 40, "moderate": 27, "advanced": 54 },
        { "hour": 18, "simple": 38, "moderate": 26, "advanced": 56 },
        { "hour": 19, "simple": 37, "moderate": 25, "advanced": 58 },
        { "hour": 20, "simple": 35, "moderate": 24, "advanced": 60 },
        { "hour": 21, "simple": 33, "moderate": 23, "advanced": 62 },
        { "hour": 22, "simple": 32, "moderate": 22, "advanced": 63 },
        { "hour": 23, "simple": 31, "moderate": 21, "advanced": 64 }
      ]
    };

    function getFilteredData() {
      let data = JSON.parse(JSON.stringify(rawData));

  // Sophistication filter: affects sophistication + timeline
  if (filters.sophistication) {
      data.sophistication = data.sophistication.filter(d => d.class === filters.sophistication);
      
      data.hourlyActivity = data.hourlyActivity.map(h => {
        const filtered = { hour: h.hour };
        const key = filters.sophistication.toLowerCase();
        filtered[key] = h[key];
        return filtered;
      });
    }

    // Country filter: affects attackTypes using countryToAttackType
    if (filters.country) {
      const mapping = rawData.countryToAttackType.find(c => c.country === filters.country);
      if (mapping) {
        data.attackTypes = [
          { type: 'Scraping',            share: mapping.scraping },
          { type: 'Credential Stuffing', share: mapping.credential },
          { type: 'Scanning',            share: mapping.scanning },
          { type: 'Carding',             share: mapping.carding },
          { type: 'Fake Engagement',     share: mapping.fake }
        ];
      }
    }

    // AttackType filter: local filter on the matrix bars
    if (filters.attackType) {
      data.attackTypes = data.attackTypes.filter(d => d.type === filters.attackType);
    }

    // NOTE: we no longer filter countries here – drawNetwork handles highlighting

    return data;
    }

    function updateFilterDisplay() {
      const container = document.getElementById('activeFilters');
      container.innerHTML = '';

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          const tag = document.createElement('div');
          tag.className = 'filter-tag';
          tag.innerHTML = `${key}: ${value} <span class="remove">×</span>`;
          tag.querySelector('.remove').onclick = () => {
            filters[key] = null;
            if (key === 'country') {
              updateAllVisualizations();                   // country changed → update network
            } else {
              updateAllVisualizations({ skipNetwork: true }); // sophistication/attackType → leave network alone
            }
          };

          container.appendChild(tag);
        }
      });
    }

    function updateAllVisualizations(options = {}) {
      const { skipNetwork = false } = options;

      updateFilterDisplay();
      const data = getFilteredData();
      drawTreemap(data);
      drawTimeline(data);
      drawMatrix(data);

      if (!skipNetwork) {
        drawNetwork(data);
      }
    }

    function drawTreemap(data) {
      const container = document.getElementById('treemap');
      container.innerHTML = '';

      const width = container.clientWidth;
      const height = 260;

      const svg = d3.select('#treemap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const hierarchy = d3.hierarchy({ children: data.sophistication })
        .sum(d => d.share);

      const treemap = d3.treemap()
        .size([width, height])
        .padding(2);

      treemap(hierarchy);

      const cells = svg.selectAll('g')
        .data(hierarchy.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      cells.append('rect')
        .attr('class', d => {
          let classes = 'treemap-cell';
          if (filters.sophistication && d.data.class !== filters.sophistication) classes += ' dimmed';
          if (filters.sophistication === d.data.class) classes += ' active';
          return classes;
        })
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => sophisticationColors[d.data.class])
        .on('click', (event, d) => {
          filters.sophistication = filters.sophistication === d.data.class ? null : d.data.class;
          updateAllVisualizations({ skipNetwork: true });
        });

      cells.append('text')
        .attr('class', 'treemap-text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '16px')
        .text(d => d.data.class);

      cells.append('text')
        .attr('class', 'treemap-text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 + 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        .text(d => `${d.data.share}%`);
    }

    function drawTimeline(data) {
      const container = document.getElementById('timeline');
      container.innerHTML = '';

      const margin = { top: 20, right: 30, bottom: 50, left: 50 };
      const width = container.clientWidth - margin.left - margin.right;
      const height = 260 - margin.top - margin.bottom;

      const svg = d3.select('#timeline')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([0, 23]).range([0, width]);
      const y = d3.scaleLinear()
        .domain([0, d3.max(data.hourlyActivity, d => Math.max(d.simple || 0, d.moderate || 0, d.advanced || 0))])
        .range([height, 0]);

      svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));

      ['simple', 'moderate', 'advanced'].forEach(key => {
        const className = key.charAt(0).toUpperCase() + key.slice(1);
        const hasData = data.hourlyActivity.some(d => d[key] !== undefined);
        
        if (!hasData) return;

        const area = d3.area()
          .x(d => x(d.hour))
          .y0(height)
          .y1(d => y(d[key] || 0))
          .curve(d3.curveMonotoneX);

        const line = d3.line()
          .x(d => x(d.hour))
          .y(d => y(d[key] || 0))
          .curve(d3.curveMonotoneX);

        svg.append('path')
          .datum(data.hourlyActivity)
          .attr('class', `timeline-area ${filters.sophistication && filters.sophistication !== className ? 'dimmed' : ''}`)
          .attr('fill', sophisticationColors[className])
          .attr('d', area);

        svg.append('path')
          .datum(data.hourlyActivity)
          .attr('class', `timeline-path ${filters.sophistication && filters.sophistication !== className ? 'dimmed' : ''}`)
          .attr('stroke', sophisticationColors[className])
          .attr('d', line);
      });

      // Add hoverable points with tooltips
      ['simple', 'moderate', 'advanced'].forEach(key => {
        const className = key.charAt(0).toUpperCase() + key.slice(1);
        const hasData = data.hourlyActivity.some(d => d[key] !== undefined);
        if (!hasData) return;

        svg.selectAll(`.timeline-point-${key}`)
          .data(data.hourlyActivity)
          .join('circle')
          .attr('class', `timeline-point timeline-point-${key} ${filters.sophistication && filters.sophistication !== className ? 'dimmed' : ''}`)
          .attr('cx', d => x(d.hour))
          .attr('cy', d => y(d[key] || 0))
          .attr('r', 3)
          .attr('fill', sophisticationColors[className])
          .append('title')
          .text(d => `${className} bots at ${d.hour}:00 — ${d[key] || 0} activity`);
      });
      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(12).tickFormat(d => `${d}:00`));

      svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y));
    }

    function drawMatrix(data) {
      const container = document.getElementById('matrix');
      container.innerHTML = '';

      const margin = { top: 20, right: 30, bottom: 80, left: 50 };
      const width = container.clientWidth - margin.left - margin.right;
      const height = 260 - margin.top - margin.bottom;

      const svg = d3.select('#matrix')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.attackTypes.map(d => d.type))
        .range([0, width])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data.attackTypes, d => d.share)])
        .range([height, 0]);

      svg.selectAll('.matrix-bar')
        .data(data.attackTypes)
        .join('rect')
        .attr('class', d => {
          let classes = 'matrix-bar';
          if (filters.attackType && d.type !== filters.attackType) classes += ' dimmed';
          if (filters.attackType === d.type) classes += ' active';
          return classes;
        })
        .attr('x', d => x(d.type))
        .attr('y', d => y(d.share))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.share))
        .attr('fill', d => attackTypeColors[d.type])
        .on('click', (event, d) => {
          filters.attackType = filters.attackType === d.type ? null : d.type;
          updateAllVisualizations();
        });

      svg.selectAll('.bar-label')
        .data(data.attackTypes)
        .join('text')
        .attr('x', d => x(d.type) + x.bandwidth() / 2)
        .attr('y', d => y(d.share) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e5e7eb')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(d => `${d.share}%`);

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y));
    }

    function drawNetwork(data) {
      const container = document.getElementById('network');
      container.innerHTML = '';

      const width = container.clientWidth;
      const height = 280;

      const svg = d3.select('#network')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const nodes = data.countries.map(d => ({ id: d.country, value: d.botShare, ...d }));

      const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(nodes, d => d.value)])
        .range([10, 30]);

      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-80))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => radiusScale(d.value) + 5));

      const node = svg.selectAll('.node')
        .data(nodes)
        .join('g')
        .attr('class', d => {
          let classes = 'node';
          if (filters.country && d.country !== filters.country) classes += ' dimmed';
          if (filters.country === d.country) classes += ' active';
          return classes;
        })
        .call(d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));

      node.append('circle')
        .attr('r', d => radiusScale(d.value))
        .attr('fill', '#60a5fa')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 2);

      node.append('text')
        .text(d => d.country.length > 12 ? d.country.substring(0, 10) + '...' : d.country)
        .attr('text-anchor', 'middle')
        .attr('dy', -5);

      node.append('text')
        .text(d => `${d.botShare}%`)
        .attr('text-anchor', 'middle')
        .attr('dy', 10)
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('fill', '#60a5fa');

      node.on('click', (event, d) => {
        filters.country = filters.country === d.country ? null : d.country;
        updateAllVisualizations();
      });

      simulation.on('tick', () => {
      node.attr('transform', d => {
        const r = radiusScale(d.value);

        // clamp positions so nodes stay fully inside the SVG
        d.x = Math.max(r, Math.min(width - r, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));

        return `translate(${d.x},${d.y})`;
      });
    });
    }

    document.getElementById('resetFilters').addEventListener('click', () => {
      Object.keys(filters).forEach(key => filters[key] = null);
      updateAllVisualizations();
    });

    updateAllVisualizations();

// ========================================
// PREDICTION SECTION INTERACTION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const predictionBtns = document.querySelectorAll('.prediction-btn');
  const resultDiv = document.getElementById('predictionResult');
  
  predictionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Disable all buttons after one is clicked
      predictionBtns.forEach(b => b.disabled = true);
      
      const isCorrect = btn.dataset.answer === 'correct';
      
      // Add visual feedback
      if (isCorrect) {
        btn.classList.add('selected-correct');
      } else {
        btn.classList.add('selected-wrong');
        // Also highlight the correct answer
        const correctBtn = document.querySelector('.prediction-btn[data-answer="correct"]');
        setTimeout(() => {
          correctBtn.classList.add('selected-correct');
        }, 500);
      }
      
      // Show the result after a delay
      setTimeout(() => {
        resultDiv.style.display = 'block';
      }, 1000);
    });
  });
});

// ========================================
// GOOGLE SEARCH TREND CHART
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, checking for chart requirements...');
  
  // Check if d3 is available
  if (typeof d3 === 'undefined') {
    console.error('D3.js library not loaded!');
    return;
  }
  console.log('D3.js is available:', d3.version);
  
  const chartContainer = document.getElementById('searchTrendChart');
  
  if (!chartContainer) {
    console.error('Chart container #searchTrendChart not found!');
    return;
  }
  
  console.log('Chart container found:', chartContainer);
  
  // Global variables for overview chart functionality
  let fullDataset = null;
  let overviewBrush = null;
  let overviewXScale = null;
  let overviewSVG = null;
  let currentZoomRange = null;
  
  // Add a test element to verify the container is working
  chartContainer.innerHTML = '<div style="background: rgba(29, 155, 240, 0.2); padding: 20px; text-align: center; color: white;">Chart container is ready...</div>';
  
  let currentData = [];
  let svg, xScale, yScale, line, area, path, dots, peakCircle, peakLabel;
  
  // Country data configuration
  const countryData = {
    'worldwide': { name: 'Worldwide', flag: '🌍', color: '#00ffff', file: 'search_traffic_worldwide_2020.csv' },
    'us': { name: 'United States', flag: '🇺🇸', color: '#1f77b4', file: 'Datasets/search_country/us_search.csv' },
    'uk': { name: 'United Kingdom', flag: '🇬🇧', color: '#ff7f0e', file: 'Datasets/search_country/uk_search.csv' },
    'canada': { name: 'Canada', flag: '🇨🇦', color: '#2ca02c', file: 'Datasets/search_country/canada_search.csv' },
    'australia': { name: 'Australia', flag: '🇦🇺', color: '#d62728', file: 'Datasets/search_country/aus_search.csv' },
    'russia': { name: 'Russia', flag: '🇷🇺', color: '#9467bd', file: 'Datasets/search_country/russia_search.csv' }
  };
  
  // Track which countries are currently visible - START WITH WORLDWIDE ONLY
  let visibleCountries = new Set(['worldwide']);
  let allCountryData = {};

  // Load data from CSV files
  async function loadCountryData() {
    try {
      console.log('Loading country data...');
      
      for (const [countryCode, country] of Object.entries(countryData)) {
        try {
          const text = await d3.text(country.file);
          
          // Parse like the working CSV loader
          const lines = text.split('\n').slice(2); // Skip first 2 lines (category and empty line)
          
          const processedData = lines
            .map(line => {
              const [dateStr, valueStr] = line.split(',');
              if (!dateStr || !valueStr) return null;
              
              const date = d3.timeParse('%Y-%m-%d')(dateStr.trim());
              const value = +valueStr.trim();
              
              return { date, value, country: countryCode };
            })
            .filter(d => d && d.date && !isNaN(d.value));
          
          allCountryData[countryCode] = processedData;
          console.log(`Loaded ${processedData.length} data points for ${country.name}`);
        } catch (error) {
          console.error(`Error loading ${country.name} data:`, error);
          // Use sample data as fallback
          allCountryData[countryCode] = createSampleDataForCountry(countryCode);
        }
      }
      
      // Set fullDataset to all loaded data (unfiltered, all countries)
      fullDataset = [];
      for (const countryCode of Object.keys(countryData)) {
        if (allCountryData[countryCode]) {
          fullDataset = fullDataset.concat(allCountryData[countryCode]);
        }
      }
      fullDataset.sort((a, b) => a.date - b.date);

      // Combine visible country data
      updateChartData();
      
    } catch (error) {
      console.error('Error in loadCountryData:', error);
      // Fallback to sample data for all countries
      for (const countryCode of Object.keys(countryData)) {
        allCountryData[countryCode] = createSampleDataForCountry(countryCode);
      }
      updateChartData();
    }
  }

  // Start loading data
  loadCountryData();

  
  function createSampleDataForCountry(countryCode) {
    const baseData = createRealisticSampleData();
    const multiplier = countryData[countryCode] === 'us' ? 1.0 : Math.random() * 0.8 + 0.4;
    
    return baseData.map(d => ({
      date: d.date,
      value: Math.round(d.value * multiplier),
      country: countryCode
    }));
  }
  
  function updateChartData() {
    // Store current zoom range before updating
    const preservedZoomRange = currentZoomRange ? { ...currentZoomRange } : null;

    // Combine data from all visible countries
    currentData = [];
    for (const countryCode of visibleCountries) {
      if (allCountryData[countryCode]) {
        currentData = currentData.concat(allCountryData[countryCode]);
      }
    }
    currentData.sort((a, b) => a.date - b.date); // Ensure sorted

    console.log(`Combined data from ${visibleCountries.size} countries: ${currentData.length} points`);

    // Clear the container
    chartContainer.innerHTML = '';

    if (currentData.length === 0) {
      // Show message when no countries are selected
      chartContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #71767B; font-size: 16px; font-weight: 600;">Select countries to view data</div>';
      // Clear overview chart too
      d3.select('#overviewChart').selectAll('*').remove();
      currentZoomRange = null;
      return;
    }

    // If we had a zoom range, try to preserve it visually, but do NOT reset it here
    let displayData = currentData;
    if (currentZoomRange && currentZoomRange.start && currentZoomRange.end) {
      // Clamp zoom range to available data for display, but do not reset currentZoomRange
      const minDate = d3.min(currentData, d => d.date);
      const maxDate = d3.max(currentData, d => d.date);
      let start = currentZoomRange.start < minDate ? minDate : currentZoomRange.start;
      let end = currentZoomRange.end > maxDate ? maxDate : currentZoomRange.end;
      // If clamped range is valid, use it; else, use all data
      if (start <= end) {
        displayData = currentData.filter(d => d.date >= start && d.date <= end);
      } else {
        displayData = currentData;
      }
    }

    // Update stats, render chart, and setup controls
    updateStats(displayData.length > 0 ? displayData : currentData);
    renderChart(displayData.length > 0 ? displayData : currentData);
    setupControls(currentData); // Always use full data for controls
    createCountryControls();
    
    // Update impact indicator if an event is selected
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect && eventSelect.value && eventSelect.value !== '') {
      updateImpactIndicator(eventSelect.value);
    }
  }
  
  // Create flag button controls
  function createCountryControls() {
    const controlsContainer = document.getElementById('countryControls');
    if (!controlsContainer) {
      console.error('Country controls container not found');
      return;
    }
    
    // Clear existing content
    controlsContainer.innerHTML = '';
    controlsContainer.style.cssText = `
      display: flex;
      gap: 10px;
      justify-content: flex-start;
      margin: 10px 0;
      flex-wrap: wrap;
    `;
    
    for (const [countryCode, country] of Object.entries(countryData)) {
      const button = document.createElement('button');
      button.innerHTML = `${country.flag} ${country.name}`;
      button.className = `country-btn ${visibleCountries.has(countryCode) ? 'active' : ''}`;
      button.style.cssText = `
        padding: 8px 16px;
        border: 2px solid ${country.color};
        border-radius: 25px;
        background: ${visibleCountries.has(countryCode) ? country.color : 'transparent'};
        color: ${visibleCountries.has(countryCode) ? 'white' : country.color};
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;
        justify-content: center;
      `;
      
      button.addEventListener('click', () => toggleCountry(countryCode));
      button.addEventListener('mouseenter', () => {
        button.style.background = country.color + '50';
        button.style.transform = 'translateY(-2px)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = visibleCountries.has(countryCode) ? country.color : 'transparent';
        button.style.transform = 'translateY(0)';
      });
      
      controlsContainer.appendChild(button);
    }
    
    // Show/hide reset button based on selection
    const resetBtn = document.getElementById('resetCountries');
    if (resetBtn) {
      if (visibleCountries.size === 1 && visibleCountries.has('worldwide')) {
        resetBtn.style.display = 'none';
      } else {
        resetBtn.style.display = 'flex';
      }
    }
    
    console.log('Country controls created in sidebar');
  }
  
  // Setup reset button
  const resetCountriesBtn = document.getElementById('resetCountries');
  if (resetCountriesBtn) {
    resetCountriesBtn.addEventListener('click', () => {
      visibleCountries.clear();
      visibleCountries.add('worldwide');
      updateChartData();
    });
  }
  
  // Setup intro message close button
  const closeIntroBtn = document.getElementById('closeIntroMessage');
  const introMessage = document.getElementById('trendIntroMessage');
  if (closeIntroBtn && introMessage) {
    closeIntroBtn.addEventListener('click', () => {
      introMessage.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        introMessage.style.display = 'none';
      }, 300);
    });
  }
  
  function toggleCountry(countryCode) {
    if (visibleCountries.has(countryCode)) {
      visibleCountries.delete(countryCode);
    } else {
      visibleCountries.add(countryCode);
    }
    
    updateChartData();
  }

  function showNotice() {
    const notice = document.getElementById('searchTrendNotice');
    if (notice) notice.style.display = 'block';
    const instr = document.getElementById('fetchInstructions');
    if (instr) instr.style.display = 'none';

    // Wire up buttons (idempotent)
    const useBtn = document.getElementById('useSampleBtn');
    const howBtn = document.getElementById('howFetchBtn');
    const closeBtn = document.getElementById('closeInstrBtn');
    const useFromInstr = document.getElementById('useSampleFromInstrBtn');

    if (useBtn) useBtn.addEventListener('click', () => { hideNotice(); renderChart(sampleData); setupControls(sampleData); updateStats(sampleData); });
    if (useFromInstr) useFromInstr.addEventListener('click', () => { hideNotice(); renderChart(sampleData); setupControls(sampleData); updateStats(sampleData); });
    if (howBtn) howBtn.addEventListener('click', () => { const instr = document.getElementById('fetchInstructions'); if (instr) { instr.style.display = 'block'; instr.setAttribute('aria-hidden', 'false'); } });
    if (closeBtn) closeBtn.addEventListener('click', () => { const instr = document.getElementById('fetchInstructions'); if (instr) { instr.style.display = 'none'; instr.setAttribute('aria-hidden', 'true'); } });
  }

  function hideNotice() {
    const notice = document.getElementById('searchTrendNotice');
    if (notice) notice.style.display = 'none';
    const instr = document.getElementById('fetchInstructions');
    if (instr) { instr.style.display = 'none'; instr.setAttribute('aria-hidden', 'true'); }
  }

  // Embedded CSV data from search_traffic_worldwide_2020.csv
  const csvData = `Category: All categories

Week,Dead Internet Theory: (Worldwide)
2020-11-22,0
2020-11-29,0
2020-12-06,0
2020-12-13,0
2020-12-20,0
2020-12-27,0
2021-01-03,0
2021-01-10,0
2021-01-17,0
2021-01-24,0
2021-01-31,0
2021-02-07,0
2021-02-14,0
2021-02-21,0
2021-02-28,0
2021-03-07,0
2021-03-14,0
2021-03-21,0
2021-03-28,0
2021-04-04,0
2021-04-11,0
2021-04-18,0
2021-04-25,0
2021-05-02,0
2021-05-09,0
2021-05-16,0
2021-05-23,0
2021-05-30,0
2021-06-06,0
2021-06-13,0
2021-06-20,0
2021-06-27,0
2021-07-04,0
2021-07-11,0
2021-07-18,0
2021-07-25,0
2021-08-01,0
2021-08-08,0
2021-08-15,0
2021-08-22,0
2021-08-29,0
2021-09-05,0
2021-09-12,0
2021-09-19,0
2021-09-26,0
2021-10-03,0
2021-10-10,0
2021-10-17,0
2021-10-24,0
2021-10-31,0
2021-11-07,0
2021-11-14,0
2021-11-21,0
2021-11-28,0
2021-12-05,0
2021-12-12,0
2021-12-19,0
2021-12-26,0
2022-01-02,0
2022-01-09,0
2022-01-16,0
2022-01-23,0
2022-01-30,0
2022-02-06,0
2022-02-13,0
2022-02-20,0
2022-02-27,0
2022-03-06,0
2022-03-13,0
2022-03-20,0
2022-03-27,0
2022-04-03,0
2022-04-10,0
2022-04-17,0
2022-04-24,0
2022-05-01,0
2022-05-08,0
2022-05-15,0
2022-05-22,0
2022-05-29,0
2022-06-05,0
2022-06-12,0
2022-06-19,0
2022-06-26,0
2022-07-03,0
2022-07-10,0
2022-07-17,0
2022-07-24,0
2022-07-31,0
2022-08-07,0
2022-08-14,0
2022-08-21,0
2022-08-28,0
2022-09-04,0
2022-09-11,0
2022-09-18,0
2022-09-25,0
2022-10-02,0
2022-10-09,0
2022-10-16,0
2022-10-23,0
2022-10-30,0
2022-11-06,0
2022-11-13,0
2022-11-20,0
2022-11-27,0
2022-12-04,0
2022-12-11,0
2022-12-18,0
2022-12-25,0
2023-01-01,0
2023-01-08,0
2023-01-15,0
2023-01-22,0
2023-01-29,0
2023-02-05,0
2023-02-12,0
2023-02-19,0
2023-02-26,0
2023-03-05,0
2023-03-12,0
2023-03-19,0
2023-03-26,1
2023-04-02,1
2023-04-09,1
2023-04-16,1
2023-04-23,1
2023-04-30,1
2023-05-07,1
2023-05-14,4
2023-05-21,2
2023-05-28,3
2023-06-04,2
2023-06-11,1
2023-06-18,1
2023-06-25,2
2023-07-02,2
2023-07-09,2
2023-07-16,2
2023-07-23,2
2023-07-30,2
2023-08-06,2
2023-08-13,1
2023-08-20,1
2023-08-27,1
2023-09-03,1
2023-09-10,1
2023-09-17,1
2023-09-24,1
2023-10-01,2
2023-10-08,1
2023-10-15,1
2023-10-22,1
2023-10-29,4
2023-11-05,5
2023-11-12,3
2023-11-19,6
2023-11-26,10
2023-12-03,4
2023-12-10,4
2023-12-17,4
2023-12-24,5
2023-12-31,6
2024-01-07,13
2024-01-14,12
2024-01-21,8
2024-01-28,6
2024-02-04,6
2024-02-11,6
2024-02-18,10
2024-02-25,9
2024-03-03,7
2024-03-10,13
2024-03-17,9
2024-03-24,63
2024-03-31,100
2024-04-07,45
2024-04-14,18
2024-04-21,16
2024-04-28,14
2024-05-05,12
2024-05-12,10
2024-05-19,10
2024-05-26,9
2024-06-02,7
2024-06-09,7
2024-06-16,10
2024-06-23,8
2024-06-30,11
2024-07-07,53
2024-07-14,23
2024-07-21,17
2024-07-28,29
2024-08-04,23
2024-08-11,18
2024-08-18,19
2024-08-25,18
2024-09-01,16
2024-09-08,15
2024-09-15,16
2024-09-22,21
2024-09-29,20
2024-10-06,24
2024-10-13,19
2024-10-20,19
2024-10-27,17
2024-11-03,37
2024-11-10,17
2024-11-17,14
2024-11-24,12
2024-12-01,13
2024-12-08,18
2024-12-15,20
2024-12-22,33
2024-12-29,59
2025-01-05,32
2025-01-12,25
2025-01-19,29
2025-01-26,29
2025-02-02,21
2025-02-09,27
2025-02-16,24
2025-02-23,18
2025-03-02,22
2025-03-09,23
2025-03-16,20
2025-03-23,21
2025-03-30,20
2025-04-06,21
2025-04-13,22
2025-04-20,19
2025-04-27,22
2025-05-04,27
2025-05-11,24
2025-05-18,23
2025-05-25,25
2025-06-01,22
2025-06-08,18
2025-06-15,20
2025-06-22,19
2025-06-29,16
2025-07-06,19
2025-07-13,42
2025-07-20,16
2025-07-27,21
2025-08-03,19
2025-08-10,16
2025-08-17,16
2025-08-24,13
2025-08-31,20
2025-09-07,26
2025-09-14,18
2025-09-21,21
2025-09-28,19
2025-10-05,22
2025-10-12,24
2025-10-19,27
2025-10-26,20
2025-11-02,20
2025-11-09,14
2025-11-16,15
2025-11-23,17`;



  function processCSVText(text) {
    console.log('processCSVText function called!');
    try {
      console.log('Processing CSV text, length:', text.length);
      chartContainer.innerHTML = '<div style="background: rgba(0, 0, 255, 0.2); padding: 20px; text-align: center; color: white;">Processing data...</div>';
      
      // Split into lines and find the header row that starts with "Week"
      const lines = text.split('\n');
      console.log('CSV lines:', lines.length);
      let dataStartIndex = 0;
      
      // Find where the actual data starts (after the "Week,Dead Internet Theory:" header)
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('Week,')) {
          dataStartIndex = i + 1; // Start after the header row
          break;
        }
      }
      
      // Parse the data starting from the correct line
      const dataLines = lines.slice(dataStartIndex);
      
      const allData = dataLines
        .map(line => {
          const [dateStr, valueStr] = line.split(',');
          if (!dateStr || !valueStr || dateStr.trim() === '') return null;

          const date = d3.timeParse('%Y-%m-%d')(dateStr.trim());
          const value = +valueStr.trim();

          return { date, value };
        })
        .filter(d => d && d.date && !isNaN(d.value));

      if (allData.length === 0) {
        console.error('No valid data found in CSV');
        // Fallback to realistic sample data
        const realisticSampleData = createRealisticSampleData();
        currentData = realisticSampleData;
        updateStats(realisticSampleData);
        renderChart(realisticSampleData);
        setupControls(realisticSampleData);
        return;
      }

      console.log(`Successfully loaded ${allData.length} data points from CSV`);
      console.log('First few data points:', allData.slice(0, 5));
      console.log('Last few data points:', allData.slice(-5));
      console.log('Date range:', d3.extent(allData, d => d.date));
      console.log('Value range:', d3.extent(allData, d => d.value));

      currentData = allData;
      
      // Clear the status message
      chartContainer.innerHTML = '';
      console.log('Cleared container, about to call functions...');

      // Update stats
      console.log('Calling updateStats...');
      try {
        updateStats(allData);
        console.log('updateStats completed');
      } catch (error) {
        console.error('Error in updateStats:', error);
      }

      console.log('About to render chart...');
      // Initial render
      try {
        renderChart(allData);
        console.log('renderChart call completed');
      } catch (error) {
        console.error('Error in renderChart:', error);
      }

      // Setup interactive controls
      console.log('Setting up controls...');
      try {
        setupControls(allData);
        console.log('setupControls completed');
      } catch (error) {
        console.error('Error in setupControls:', error);
      }
      
      console.log('All initialization complete!');
      
    } catch (e) {
      console.error('Error parsing CSV data:', e);
      // Fallback to realistic sample data
      const realisticSampleData = createRealisticSampleData();
      currentData = realisticSampleData;
      updateStats(realisticSampleData);
      renderChart(realisticSampleData);
      setupControls(realisticSampleData);
    }
  }
  
  function updateStats(data) {
    // Calculate sustained attention metrics (2023-2025)
    const sustainedStartDate = new Date('2023-01-01');
    const sustainedData = data.filter(d => d.date >= sustainedStartDate && d.value > 0);
    
    // Average interest in recent period
    const avgRecent = sustainedData.length > 0 
      ? (sustainedData.reduce((sum, d) => sum + d.value, 0) / sustainedData.length).toFixed(1)
      : 0;
    
    // Number of months with consistent attention
    const consistentMonths = sustainedData.length;
    
    // Growth since 2020
    const firstNonZero = data.find(d => d.value > 0);
    const growth = firstNonZero ? (((avgRecent - firstNonZero.value) / Math.max(firstNonZero.value, 1)) * 100).toFixed(0) : '∞';
    
    const avgRecentEl = document.getElementById('avgRecent');
    const consistentMonthsEl = document.getElementById('consistentMonths');
    const growthRateEl = document.getElementById('growthRate');
    
    if (avgRecentEl) avgRecentEl.textContent = avgRecent;
    if (consistentMonthsEl) consistentMonthsEl.textContent = consistentMonths;
    if (growthRateEl) growthRateEl.textContent = growth === 'Infinity' ? '∞' : `+${growth}%`;
    
    console.log('Stats updated:', { avgRecent, consistentMonths, growth });
  }
  
  function setupControls(allData) {
    const buttons = document.querySelectorAll('.chart-btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter data based on view
        const view = btn.dataset.view;
        let filteredData = allData;
        
        if (view === 'recent') {
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
          filteredData = allData.filter(d => d.date >= twoYearsAgo);
        } else if (view === 'peak') {
          const peakData = allData.reduce((max, d) => d.value > max.value ? d : max, allData[0]);
          const peakDate = peakData.date;
          const sixMonthsBefore = new Date(peakDate);
          sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);
          const sixMonthsAfter = new Date(peakDate);
          sixMonthsAfter.setMonth(sixMonthsAfter.getMonth() + 6);
          filteredData = allData.filter(d => d.date >= sixMonthsBefore && d.date <= sixMonthsAfter);
        }
        
        // Re-render with filtered data
        updateChart(filteredData);
      });
    });
  }
  
  function renderChart(data) {
    console.log('renderChart called with data:', data?.length, 'points');
    
    if (!data || data.length === 0) {
      console.error('No data provided to renderChart');
      return;
    }
    
    // Clear previous chart
    d3.select('#searchTrendChart').selectAll('*').remove();
    
    // Set up dimensions - responsive and centered
    const margin = { top: 35, right: 50, bottom: 70, left: 60 };
    const containerWidth = Math.min(1100, chartContainer.clientWidth || 1000);
    const width = containerWidth - margin.left - margin.right;
    const height = 400;

    
    // Create SVG
    svg = d3.select('#searchTrendChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('display', 'block')
      .style('margin', '0 auto')
      .style('background', 'rgba(0,0,0,0.05)')
      .style('margin', '0 auto')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Group data by country
    const dataByCountry = d3.group(data, d => d.country);
    
    // Get date extent across all countries
    const xExtent = d3.extent(data, d => d.date);
    const yExtent = [0, d3.max(data, d => d.value)];

    // Use zoom range if available, else full data extent
    let xDomain = xExtent;
    if (currentZoomRange && currentZoomRange.start && currentZoomRange.end) {
      xDomain = [currentZoomRange.start, currentZoomRange.end];
    }

    xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, width]);

    yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([height, 0]);

    // Create line generator
    line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Dynamically choose tick interval for x-axis
    const msPerMonth = 30 * 24 * 60 * 60 * 1000;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const rangeMs = xDomain[1] - xDomain[0];
    let tickInterval, tickFormat;
    if (rangeMs < msPerMonth * 2) {
      tickInterval = d3.timeWeek.every(1);
      tickFormat = d3.timeFormat('%b %d, %Y');
    } else if (rangeMs < msPerMonth * 12) {
      tickInterval = d3.timeMonth.every(1);
      tickFormat = d3.timeFormat('%b %Y');
    } else {
      tickInterval = d3.timeMonth.every(6);
      tickFormat = d3.timeFormat('%Y-%m');
    }

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(tickFormat)
        .ticks(tickInterval))
      .selectAll('text')
      .style('fill', '#ffffff')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', '#ffffff');
    
    // Add axis labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .text('Search Interest');
    
    svg.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .text('Time');
    
    // Create tooltip
    const tooltip = d3.select('body')
      .select('.chart-tooltip')
      .empty() ? 
      d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('color', 'white')
        .style('padding', '8px 12px')
        .style('border-radius', '6px')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('z-index', 1000) :
      d3.select('.chart-tooltip');
    
    // Draw lines for each country
    dataByCountry.forEach((countryDataArray, country) => {
      const color = countryData[country]?.color || '#1f77b4';
      const countryName = countryData[country]?.name || country;
      const flag = countryData[country]?.flag || '';
      
      // Sort data by date
      const sortedData = countryDataArray.sort((a, b) => a.date - b.date);
      
      // Add the line path with special styling for worldwide
      const isWorldwide = country === 'worldwide';
      
      // Create area generator
      const area = d3.area()
        .x(d => xScale(d.date))
        .y0(height)
        .y1(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
      
      // Add semi-transparent area fill
      svg.append('path')
        .datum(sortedData)
        .attr('class', `country-area country-area-${country}`)
        .attr('fill', color)
        .attr('d', area)
        .style('opacity', isWorldwide ? 0.15 : 0.1)
        .style('pointer-events', 'none');
      
      // Add the line path on top
      const linePath = svg.append('path')
        .datum(sortedData)
        .attr('class', `country-line country-${country}`)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', isWorldwide ? 3 : 2)
        .attr('stroke-dasharray', isWorldwide ? '0' : '0')
        .attr('d', line)
        .style('opacity', isWorldwide ? 1 : 0.8)
        .style('cursor', 'pointer');
      
      // Add hover effects to the line with improved stability
      linePath
        .attr('stroke-width', isWorldwide ? 6 : 4) // Make invisible stroke wider for easier hovering
        .style('stroke-opacity', 0) // Make the hover area invisible
        .clone(true) // Clone for the visible line
        .attr('stroke-width', isWorldwide ? 3 : 2)
        .style('stroke-opacity', 1)
        .style('pointer-events', 'none'); // Only the thicker invisible line handles events
      
      linePath
        .on('mouseenter', function(event) {
          // Find and highlight the visible line
          svg.select(`.country-${country}[stroke-opacity="1"]`)
            .transition()
            .duration(100)
            .attr('stroke-width', isWorldwide ? 4 : 3)
            .style('opacity', 1);
          
          // Highlight the area fill
          svg.select(`.country-area-${country}`)
            .transition()
            .duration(100)
            .style('opacity', isWorldwide ? 0.3 : 0.25);
          
          tooltip
            .style('opacity', 1)
            .html(`${flag} ${countryName}`);
        })
        .on('mouseleave', function() {
          svg.select(`.country-${country}[stroke-opacity="1"]`)
            .transition()
            .duration(100)
            .attr('stroke-width', isWorldwide ? 3 : 2)
            .style('opacity', isWorldwide ? 1 : 0.8);
          
          // Reset area fill opacity
          svg.select(`.country-area-${country}`)
            .transition()
            .duration(100)
            .style('opacity', isWorldwide ? 0.15 : 0.1);
          
          tooltip.style('opacity', 0);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        });
      
      // Add dots for data points
      svg.selectAll(`.dot-${country}`)
        .data(sortedData)
        .enter().append('circle')
        .attr('class', `dot dot-${country}`)
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.value))
        .attr('r', isWorldwide ? 4 : 3)
        .attr('fill', color)
        .style('opacity', isWorldwide ? 1 : 0.7)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', isWorldwide ? 6 : 5)
            .style('opacity', 1);
          
          tooltip
            .style('opacity', 1)
            .html(`
              <div>${flag} ${countryName}</div>
              <div style="margin-top: 4px; font-size: 12px;">
                ${d3.timeFormat('%B %d, %Y')(d.date)}<br>
                Search Interest: <strong>${d.value}</strong>
              </div>
            `);
        })
        .on('mouseleave', function() {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', isWorldwide ? 4 : 3)
            .style('opacity', isWorldwide ? 1 : 0.7);
          
          tooltip.style('opacity', 0);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        });
    });
    
    // Store global variables for overview chart
    window.currentXScale = xScale;
    window.currentYScale = yScale;
    
    // Store data for overview
    if (!fullDataset || data.length > (fullDataset?.length || 0) * 0.8) {
      fullDataset = [...data];
    }
    
    // Render overview chart after a brief delay
    setTimeout(() => {
      renderOverviewChart();
    }, 100);

    console.log(`Chart rendered with ${dataByCountry.size} countries`);
  }
  
  // Additional chart functions and utilities
  
  // Function to add event line marker
  function addEventLineMarker(eventKey) {
    const event = eventsData[eventKey];
    if (!event || !event.showLine || !window.currentXScale) return;
    
    const svg = d3.select('#searchTrendChart svg g');
    
    // Remove existing event lines
    svg.selectAll('.event-line').remove();
    
    const x = window.currentXScale(event.date);
    const height = window.currentYScale.range()[0];
    
    // Add vertical line
    const line = svg.append('line')
      .attr('class', 'event-line')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', '#ff6b9d')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', '5,5')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    
    // Add event label next to the line
    const labelText = event.description || event.name.split(' (')[0];
    const label = svg.append('text')
      .attr('class', 'event-line event-label')
      .attr('x', x + 15)
      .attr('y', 30)
      .style('fill', '#ff6b9d')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('cursor', 'pointer')
      .text(labelText)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    
    // Add hover functionality for detailed information
    label.on('mouseover', function(mouseEvent) {
      d3.select(this).style('text-decoration', 'underline');
      
      // Show detailed tooltip
      const tooltip = d3.select('.tooltip');
      tooltip
        .html(`
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">${event.description}</div>
          <div style="font-size: 11px; opacity: 0.8;">Date: ${event.date.toLocaleDateString()}</div>
          ${event.articleUrl ? '<div style="font-size: 11px; margin-top: 4px; color: #1D9BF0;">Click to view more information</div>' : ''}
        `)
        .classed('visible', true);
      
      positionTooltip(tooltip, mouseEvent.pageX, mouseEvent.pageY, 15, 15);
    })
    .on('mouseout', function() {
      d3.select(this).style('text-decoration', 'none');
      d3.select('.tooltip').classed('visible', false);
    })
    .on('click', function() {
      if (event.articleUrl) {
        window.open(event.articleUrl, '_blank');
      }
    });
    
    // Update impact value display
    const impactValue = document.getElementById('impactValue');
    if (impactValue) {
      const impactText = getImpactLevelText(event.impact);
      impactValue.textContent = `${event.name} - ${impactText}`;
      impactValue.style.color = '#ffd700';
    }
  }

  // Function to zoom chart to specific date range
  function zoomToEvent(eventKey) {
    const event = eventsData[eventKey];
    if (!event || !event.zoomRange) {
      console.log('Event not found or missing zoom range:', eventKey);
      return;
    }
    
    console.log('Zooming to event:', event.name);
    console.log('Zoom range:', event.zoomRange.start, 'to', event.zoomRange.end);
    
    // Set the currentZoomRange so overview chart can highlight it
    currentZoomRange = {
      start: event.zoomRange.start,
      end: event.zoomRange.end
    };
    
    // Filter data to zoom range
    const zoomedData = currentData.filter(d => 
      d.date >= event.zoomRange.start && d.date <= event.zoomRange.end
    );
    
    console.log('Filtered data points:', zoomedData.length);
    
    if (zoomedData.length > 0) {
      renderChart(zoomedData);
      
      // Add line marker after a short delay to ensure chart is rendered
      setTimeout(() => {
        addEventLineMarker(eventKey);
      }, 100);
    } else {
      console.log('No data points found in zoom range');
    }
  }

  // Generate a realistic dataset based on the actual CSV structure
  function createRealisticSampleData() {
    const samplePoints = [
      { date: new Date('2020-11-22'), value: 0 },
      { date: new Date('2021-01-01'), value: 0 },
      { date: new Date('2021-06-01'), value: 0 },
      { date: new Date('2021-12-01'), value: 1 },
      { date: new Date('2022-03-01'), value: 2 },
      { date: new Date('2022-06-01'), value: 5 },
      { date: new Date('2022-09-01'), value: 8 },
      { date: new Date('2022-11-30'), value: 12 }, // Around ChatGPT launch
      { date: new Date('2023-01-01'), value: 18 },
      { date: new Date('2023-03-14'), value: 25 }, // GPT-4 release
      { date: new Date('2023-06-01'), value: 22 },
      { date: new Date('2023-09-01'), value: 19 },
      { date: new Date('2023-12-01'), value: 21 },
      { date: new Date('2024-03-01'), value: 24 },
      { date: new Date('2024-06-01'), value: 26 },
      { date: new Date('2024-09-01'), value: 23 },
      { date: new Date('2024-12-01'), value: 20 },
      { date: new Date('2025-03-01'), value: 22 },
      { date: new Date('2025-06-01'), value: 25 },
      { date: new Date('2025-09-01'), value: 21 },
      { date: new Date('2025-11-23'), value: 17 }
    ];
    
    // Generate weekly data points by interpolating between these key points
    const weeklyData = [];
    for (let i = 0; i < samplePoints.length - 1; i++) {
      const start = samplePoints[i];
      const end = samplePoints[i + 1];
      
      const startTime = start.date.getTime();
      const endTime = end.date.getTime();
      const weekMs = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      
      for (let time = startTime; time <= endTime; time += weekMs) {
        const progress = (time - startTime) / (endTime - startTime);
        const interpolatedValue = start.value + (end.value - start.value) * progress;
        
        // Add some realistic noise
        const noise = (Math.random() - 0.5) * 3;
        const finalValue = Math.max(0, Math.round(interpolatedValue + noise));
        
        weeklyData.push({
          date: new Date(time),
          value: finalValue
        });
      }
    }
    
    return weeklyData.sort((a, b) => a.date - b.date);
  }

  // Generate a lightweight sample dataset (monthly points) for the chart
  function createSampleData() {
    const start = new Date('2020-01-01');
    const end = new Date('2025-12-01');
    const arr = [];
    const cur = new Date(start);
    while (cur <= end) {
      // simple seasonal-ish sample values
      const month = cur.getMonth();
      const base = 20 + (month % 12) * 3;
      const noise = Math.round((Math.sin(cur.getTime() / 1e10) + Math.random() * 0.6) * 10);
      arr.push({ date: new Date(cur), value: Math.max(0, base + noise) });
      cur.setMonth(cur.getMonth() + 1);
    }
    return arr;
  }
  
  function updateChart(data) {
    // Update scales
    xScale.domain(d3.extent(data, d => d.date));
    yScale.domain([0, d3.max(data, d => d.value) * 1.15]);
    // Clear and re-render
    renderChart(data);
    // Update overview to show current zoom
    renderOverviewChart();
  }
  
  // Simple overview chart
  function renderOverviewChart() {
    const container = document.getElementById('overviewChart');
    if (!container || !fullDataset || fullDataset.length === 0) return;
    
    d3.select('#overviewChart').selectAll('*').remove();
    
    const margin = {top: 5, right: 10, bottom: 5, left: 10};
    const width = container.clientWidth - margin.left - margin.right;
    const height = 50;
    
    const svg = d3.select('#overviewChart')
      .append('svg')
      .attr('width', container.clientWidth)
      .attr('height', 60);
      
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales based on FULL dataset
    const x = d3.scaleTime()
      .domain(d3.extent(fullDataset, d => d.date))
      .range([0, width]);
      
    const y = d3.scaleLinear()
      .domain([0, d3.max(fullDataset, d => d.value)])
      .range([height, 0]);
    
    // Draw line for each visible country
    const byCountry = d3.group(fullDataset, d => d.country);
    
    byCountry.forEach((data, country) => {
      if (visibleCountries.has(country)) {
        const line = d3.line()
          .x(d => x(d.date))
          .y(d => y(d.value))
          .curve(d3.curveMonotoneX);
          
        const color = countryData[country]?.color || '#1f77b4';
        
        g.append('path')
          .datum(data.sort((a, b) => a.date - b.date))
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', country === 'worldwide' ? 1.5 : 1)
          .attr('d', line)
          .attr('opacity', 0.7);
      }
    });
    
    // Highlight current view from main chart
    const currentDomain = xScale.domain();
    if (currentDomain && currentDomain[0] && currentDomain[1]) {
      const x0 = x(currentDomain[0]);
      const x1 = x(currentDomain[1]);
      
      g.append('rect')
        .attr('x', x0)
        .attr('y', 0)
        .attr('width', x1 - x0)
        .attr('height', height)
        .attr('fill', 'rgba(74, 158, 255, 0.3)')
        .attr('stroke', '#4a9eff')
        .attr('stroke-width', 2)
        .attr('rx', 2);
    }
  }
  

  
  // Add scroll animation for chart appearance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  
  const chartElement = document.querySelector('#searchTrendChart');
  if (chartElement) {
    observer.observe(chartElement);
  }

  // Key AI and Bot Innovation Events with search traffic data
  const eventsData = {
    'facebook-ai-policy': {
      name: 'Facebook Response to "AI Slop" (March 31st, 2024)',
      date: new Date('2024-03-31'),
      peakValue: 95,
      impact: 90,
      description: 'Meta introduces AI content labeling',
      articleUrl: 'https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/',
      showLine: true,
      zoomRange: {
        start: new Date('2024-02-20'),
        end: new Date('2024-05-20')
      }
    },
    'chatgpt-launch': {
      name: 'ChatGPT Launch (November 30th, 2022)',
      date: new Date('2022-11-30'),
      peakValue: 89,
      impact: 75,
      description: 'OpenAI launches ChatGPT to public',
      showLine: true,
      zoomRange: {
        start: new Date('2022-10-15'),
        end: new Date('2023-01-15')
      }
    },
    'gpt4-release': {
      name: 'GPT-4 Release (March 14th, 2023)',
      date: new Date('2023-03-14'),
      peakValue: 142,
      impact: 85,
      description: 'Advanced AI model with multimodal capabilities',
      showLine: true,
      zoomRange: {
        start: new Date('2023-01-30'),
        end: new Date('2023-04-30')
      }
    },
    'openai-board-crisis': {
      name: 'OpenAI Board Crisis (November 26th, 2023)',
      date: new Date('2023-11-26'),
      peakValue: 78,
      impact: 80,
      description: 'Sam Altman briefly ousted then reinstated',
      showLine: true,
      zoomRange: {
        start: new Date('2023-10-12'),
        end: new Date('2024-01-12')
      }
    },
    'bing-ai': {
      name: 'Bing AI Integration (February 7th, 2023)',
      date: new Date('2023-02-07'),
      peakValue: 78,
      impact: 65,
      description: 'Medium-High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2022-12-22'),
        end: new Date('2023-03-22')
      }
    },
    'ai-regulation': {
      name: 'EU AI Act Discussions (June 2023)',
      date: new Date('2023-06-15'),
      peakValue: 45,
      impact: 55,
      description: 'Medium Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2023-05-01'),
        end: new Date('2023-08-01')
      }
    },
    'twitter-bots': {
      name: 'Twitter Bot Purge (October 2022)',
      date: new Date('2022-10-15'),
      peakValue: 35,
      impact: 45,
      description: 'Medium Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2022-09-01'),
        end: new Date('2022-12-01')
      }
    }
  };
  
  // Function to determine impact level text based on numeric impact value
  function getImpactLevelText(impactValue) {
    if (impactValue >= 90) {
      return 'Very High Impact';
    } else if (impactValue >= 80) {
      return 'High Impact';
    } else if (impactValue >= 60) {
      return 'Medium-High Impact';
    } else if (impactValue >= 40) {
      return 'Medium Impact';
    } else if (impactValue >= 20) {
      return 'Low-Medium Impact';
    } else {
      return 'Low Impact';
    }
  }

  // Function to add event line marker
  function addEventLineMarker(eventKey) {
    const event = eventsData[eventKey];
    if (!event || !event.showLine || !xScale) return;
    
    const svgGroup = d3.select('#searchTrendChart svg g');
    
    // Remove existing event lines
    svgGroup.selectAll('.event-line').remove();
    
    const x = xScale(event.date);
    const height = yScale.range()[0];
    
    // Add vertical line with hover functionality
    const line = svgGroup.append('line')
      .attr('class', 'event-line')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', '#ff6b9d')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', '5,5')
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    
    // Add hover functionality to the line
    line.on('mouseover', function(mouseEvent) {
      // Create tooltip content based on event
      let tooltipContent = '';
      if (eventKey === 'facebook-ai-policy') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">Meta introduces mandatory AI labeling policy requiring all AI-generated content to be clearly marked.</div>
          <div style="font-size: 11px; opacity: 0.8; font-style: italic;">Click to read Meta's announcement</div>
        `;
      } else if (eventKey === 'chatgpt-launch') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">OpenAI launches ChatGPT to the public, sparking widespread AI adoption and concerns about AI-generated content.</div>
        `;
      } else if (eventKey === 'gpt4-release') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">OpenAI releases GPT-4, a major advancement in language models with improved capabilities and multimodal features.</div>
        `;
      } else if (eventKey === 'openai-board-crisis') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">Sam Altman is briefly ousted then reinstated as OpenAI CEO, highlighting AI governance concerns and industry instability.</div>
        `;
      } else if (eventKey === 'bing-ai') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">Microsoft integrates ChatGPT into Bing search, marking the first major AI integration in web search.</div>
        `;
      } else if (eventKey === 'ai-regulation') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">European Union discusses comprehensive AI regulation, addressing concerns about AI safety and transparency.</div>
        `;
      } else if (eventKey === 'twitter-bots') {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div style="margin-bottom: 6px;">Twitter conducts major bot removal campaign, highlighting the scale of automated content on social platforms.</div>
        `;
      } else {
        tooltipContent = `
          <div style="font-weight: 600; margin-bottom: 8px;">${event.name}</div>
          <div>Significant AI or bot-related event affecting internet discourse.</div>
        `;
      }
      
      // Show tooltip
      const tooltip = d3.select('body').selectAll('.line-tooltip').data([1]);
      const tooltipEnter = tooltip.enter().append('div').attr('class', 'line-tooltip');
      
      const tooltipMerged = tooltip.merge(tooltipEnter)
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.95)')
        .style('color', 'white')
        .style('padding', '12px')
        .style('border-radius', '8px')
        .style('font-size', '13px')
        .style('line-height', '1.4')
        .style('max-width', '300px')
        .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
        .style('border', '1px solid #ff6b9d')
        .style('z-index', '1000')
        .style('opacity', 0)
        .html(tooltipContent);
      
      // Position tooltip
      const tooltipNode = tooltipMerged.node();
      const rect = tooltipNode.getBoundingClientRect();
      const x = mouseEvent.pageX;
      const y = mouseEvent.pageY;
      
      let left = x + 15;
      let top = y - rect.height - 10;
      
      // Adjust if tooltip goes off screen
      if (left + rect.width > window.innerWidth) {
        left = x - rect.width - 15;
      }
      if (top < 0) {
        top = y + 15;
      }
      
      tooltipMerged
        .style('left', left + 'px')
        .style('top', top + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
    })
    .on('mouseout', function() {
      d3.select('.line-tooltip')
        .transition()
        .duration(200)
        .style('opacity', 0)
        .remove();
    })
    .on('click', function() {
      if (event.articleUrl) {
        window.open(event.articleUrl, '_blank');
      }
    });
    
    // Add event label with description next to the line
    const eventDescription = event.description || event.name.split(' (')[0];
    const label = svgGroup.append('text')
      .attr('class', 'event-line event-description')
      .attr('x', x + 15)
      .attr('y', 30)
      .style('fill', '#ff6b9d')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('cursor', 'pointer')
      .text(eventDescription)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);

    // Update impact value display
    const impactValue = document.getElementById('impactValue');
    if (impactValue) {
      const impactText = getImpactLevelText(event.impact);
      impactValue.textContent = `${event.name} - ${impactText}`;
      impactValue.style.color = '#ffd700';
    }
    
    // Add "Hover for more info" text next to the line
    const hoverText = svgGroup.append('text')
      .attr('class', 'event-line hover-hint')
      .attr('x', x + 10)
      .attr('y', height - 30)
      .style('fill', '#ff6b9d')
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('opacity', 0.8)
      .style('font-style', 'italic')
      .style('pointer-events', 'none')
      .text('💡 Hover for info')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(300)
      .style('opacity', 0.8);
    
    // Add hover functionality only if there's an article URL
    if (event.articleUrl) {
      label.on('mouseover', function(mouseEvent) {
        d3.select(this).style('text-decoration', 'underline');
      })
      .on('mouseout', function() {
        d3.select(this).style('text-decoration', 'none');
      })
      .on('click', function() {
        window.open(event.articleUrl, '_blank');
      });
    }
  }

  // Function to zoom chart to specific date range
  function zoomToEvent(eventKey) {
    const event = eventsData[eventKey];
    if (!event || !event.zoomRange) {
      console.log('Event not found or missing zoom range:', eventKey);
      return;
    }
    
    console.log('Zooming to event:', event.name);
    console.log('Zoom range:', event.zoomRange.start, 'to', event.zoomRange.end);
    
    // Filter data to zoom range
    const zoomedData = currentData.filter(d => 
      d.date >= event.zoomRange.start && d.date <= event.zoomRange.end
    );
    
    console.log('Filtered data points:', zoomedData.length);
    
    if (zoomedData.length > 0) {
      renderChart(zoomedData);
      
      // Add line marker after a short delay to ensure chart is rendered
      setTimeout(() => {
        addEventLineMarker(eventKey);
      }, 200);
    } else {
      console.log('No data points found in zoom range');
    }
  }

  // Set up event handling for dropdown
  const eventSelect = document.getElementById('eventSelect');

  if (eventSelect) {
    eventSelect.addEventListener('change', () => {
      const selectedEvent = eventSelect.value;
      console.log('Event selected:', selectedEvent);
      
      // If no event selected (placeholder), show full chart
      if (!selectedEvent || selectedEvent === '') {
        console.log('Showing full chart');
        
        // Reset zoom range
        currentZoomRange = null;
        
        renderChart(currentData);
        
        // Reset impact value to placeholder
        const impactValue = document.getElementById('impactValue');
        if (impactValue) {
          impactValue.textContent = 'Select an event to see impact';
          impactValue.style.color = '#ffd700';
        }
        return;
      }
      
      // Find the event data for zoom and line marker functionality
      const eventData = eventsData[selectedEvent];
      
      if (eventData && eventData.zoomRange && eventData.showLine) {
        console.log('Zooming to event:', eventData.name);
        zoomToEvent(selectedEvent);
      } else {
        console.log('Event data not found or missing zoom properties:', selectedEvent);
      }
    });
  }
});

// ========================================
// IMPACTFUL EVENTS VISUALIZATION (Integrated with Search Trend)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const eventSelect = document.getElementById('eventSelect');
  const countrySelect = document.getElementById('countrySelect');
  const impactFill = document.getElementById('impactFill');
  const impactThumb = document.getElementById('impactThumb');
  const impactValue = document.getElementById('impactValue');
  
  if (!eventSelect) return;
  
  let baseSearchData = []; // Store the original search trend data
  
  // Key AI and Bot Innovation Events with search traffic data
  const eventsData = {
    'facebook-ai-policy': {
      name: 'Facebook "AI Slop" Response',
      date: new Date('2024-03-31'),
      impact: 95, // Massive spike in search interest - highest on record
      description: 'Very High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2024-03-01'),
        end: new Date('2024-05-01')
      }
    },
    'chatgpt-launch': {
      name: 'ChatGPT Launch',
      date: new Date('2022-11-30'),
      impact: 65, // Moderate increase, beginning of trend
      description: 'High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2022-10-30'),
        end: new Date('2023-01-15')
      }
    },
    'gpt4-release': {
      name: 'GPT-4 Release',
      date: new Date('2023-03-14'),
      impact: 85, // Major spike in March 2023
      description: 'Very High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2023-02-15'),
        end: new Date('2023-04-30')
      }
    },
    'openai-board-crisis': {
      name: 'OpenAI Board Crisis',
      date: new Date('2023-11-26'),
      impact: 78, // Significant increase during crisis period
      description: 'High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2023-11-01'),
        end: new Date('2023-12-31')
      }
    }
  };
  
  // Add event listener for the dropdown
  eventSelect.addEventListener('change', () => {
    const selectedEvent = eventSelect.value;
    updateImpactIndicator(selectedEvent);
  });
  
  // Initialize with empty state
  updateImpactIndicator('');
  
  // Function to determine impact level text based on numeric impact value
  function getImpactLevelText(impactValue) {
    if (impactValue >= 90) {
      return 'Very High Impact';
    } else if (impactValue >= 80) {
      return 'High Impact';
    } else if (impactValue >= 60) {
      return 'Medium-High Impact';
    } else if (impactValue >= 40) {
      return 'Medium Impact';
    } else if (impactValue >= 20) {
      return 'Low-Medium Impact';
    } else {
      return 'Low Impact';
    }
  }
  
  // Country multipliers to simulate different regional interests
  const countryMultipliers = {
    'worldwide': 1.0,
    'united-states': 1.2,
    'united-kingdom': 0.8,
    'canada': 0.7,
    'australia': 0.6,
    'russia': 1.4
  };
  
  function updateImpactIndicator(eventKey) {
    if (!impactFill || !impactThumb) return;
    
    // Handle empty/placeholder selection
    if (!eventKey || eventKey === '') {
      impactFill.style.width = '0%';
      impactThumb.style.left = '0%';
      impactFill.style.background = 'linear-gradient(90deg, #71767B, #1D9BF0)';
      
      // Reset impact value text to placeholder
      const impactValue = document.getElementById('impactValue');
      if (impactValue) {
        impactValue.textContent = 'Select an event to see impact';
        impactValue.style.color = '#ffd700';
      }
      return;
    }
    
    const event = eventsData[eventKey];
    if (!event) return;
    
    // Calculate impact based on average of visible countries during event period
    let impact = event.impact; // Default to base impact
    
    // Special handling for ChatGPT launch: no impact
    if (eventKey === 'chatgpt-launch') {
      impact = 0;
    }
    // Special handling for GPT-4 release: low impact only for worldwide and US
    else if (eventKey === 'gpt4-release') {
      // Check if only worldwide and/or US are selected
      const relevantCountries = Array.from(visibleCountries).filter(c => c === 'worldwide' || c === 'us');
      
      if (relevantCountries.length === 0) {
        // None of the relevant countries are selected
        impact = 0;
      } else if (fullDataset && visibleCountries && visibleCountries.size > 0) {
        // Calculate impact only for worldwide and US
        const eventStart = event.zoomRange.start;
        const eventEnd = event.zoomRange.end;
        
        let totalAverage = 0;
        let countryCount = 0;
        
        for (const countryCode of relevantCountries) {
          const countryDataset = fullDataset[countryCode];
          if (!countryDataset) continue;
          
          const eventPeriodData = countryDataset.filter(d => 
            d.date >= eventStart && d.date <= eventEnd
          );
          
          if (eventPeriodData.length > 0) {
            const countryAverage = eventPeriodData.reduce((sum, d) => sum + d.value, 0) / eventPeriodData.length;
            totalAverage += countryAverage;
            countryCount++;
          }
        }
        
        if (countryCount > 0) {
          const avgValue = totalAverage / countryCount;
          // Cap at 35 (low impact) for GPT-4
          impact = Math.min(35, Math.max(0, avgValue));
        }
      }
    }
    // Normal calculation for other events
    else if (fullDataset && visibleCountries && visibleCountries.size > 0) {
      const eventStart = event.zoomRange.start;
      const eventEnd = event.zoomRange.end;
      
      let totalAverage = 0;
      let countryCount = 0;
      
      // Calculate average for each visible country
      for (const countryCode of visibleCountries) {
        const countryDataset = fullDataset[countryCode];
        if (!countryDataset) continue;
        
        // Filter data points within event range
        const eventPeriodData = countryDataset.filter(d => 
          d.date >= eventStart && d.date <= eventEnd
        );
        
        if (eventPeriodData.length > 0) {
          const countryAverage = eventPeriodData.reduce((sum, d) => sum + d.value, 0) / eventPeriodData.length;
          totalAverage += countryAverage;
          countryCount++;
        }
      }
      
      // Calculate final impact as percentage (normalized to 0-100 scale)
      if (countryCount > 0) {
        const avgValue = totalAverage / countryCount;
        // Normalize: assume max search interest is around 100, scale to percentage
        impact = Math.min(100, Math.max(0, avgValue));
      }
    }
    
    const fillWidth = `${impact}%`;
    const thumbPosition = `calc(${impact}% - 9px)`;
    
    // Update the visual indicator with animation
    impactFill.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.6s ease';
    impactThumb.style.transition = 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease';
    
    impactFill.style.width = fillWidth;
    impactThumb.style.left = thumbPosition;
    
    // Update impact value text
    const impactValueEl = document.getElementById('impactValue');
    if (impactValueEl) {
      const impactText = getImpactLevelText(impact);
      impactValueEl.textContent = impactText;
      
      // Color based on impact level
      if (impact >= 80) {
        impactValueEl.style.color = '#ffd700';
      } else if (impact >= 60) {
        impactValueEl.style.color = '#ff9500';
      } else if (impact > 0) {
        impactValueEl.style.color = '#1D9BF0';
      } else {
        impactValueEl.style.color = '#555';
      }
    }
    
    // Add visual feedback based on impact level
    let glowColor = '#1D9BF0'; // Default blue
    if (impact >= 80) {
      glowColor = '#ffd700'; // Gold for high impact
    } else if (impact >= 60) {
      glowColor = '#ff9500'; // Orange for medium-high
    } else if (impact >= 40) {
      glowColor = '#1D9BF0'; // Blue for medium
    } else if (impact > 0) {
      glowColor = '#71767B'; // Gray for low
    } else {
      glowColor = '#3a3a3a'; // Dark gray for no impact
    }
    
    impactThumb.style.background = glowColor;
    impactThumb.style.boxShadow = `0 0 12px ${glowColor}80`;
    
    // Update fill gradient based on impact
    if (impact >= 70) {
      impactFill.style.background = `linear-gradient(90deg, #1D9BF0, #ffd700)`;
    } else if (impact >= 40) {
      impactFill.style.background = `linear-gradient(90deg, #1D9BF0, #ff9500)`;
    } else if (impact > 0) {
      impactFill.style.background = `linear-gradient(90deg, #71767B, #1D9BF0)`;
    } else {
      impactFill.style.background = `#3a3a3a`;
    }
  }
  
  function generateEventOverlayData(eventKey, baseData) {
    const event = eventsData[eventKey];
    if (!event || !event.date) return baseData;
    
    return baseData.map(d => {
      const daysDiff = Math.abs((event.date - d.date) / (1000 * 60 * 60 * 24));
      
      let eventImpact = 0;
      if (daysDiff <= 7) {
        // Peak around event date - use actual impact value
        eventImpact = event.peakValue * Math.exp(-Math.pow(daysDiff / 3, 2)) * (event.impact / 100);
      } else if (daysDiff <= 30) {
        // Decline after event
        eventImpact = event.peakValue * 0.3 * Math.exp(-daysDiff / 15) * (event.impact / 100);
      }
      
      return {
        ...d,
        value: Math.max(d.value + eventImpact * 0.4, d.value),
        eventName: daysDiff <= 30 ? event.name : 'Background Activity'
      };
    });
  }
  
  function applyCountryAndImpactFilters(data) {
    const countryMultiplier = countryMultipliers[countrySelect?.value] || 1.0;
    
    return data.map(d => ({
      ...d,
      value: d.value * countryMultiplier
    }));
  }
  
  function updateVisualizationWithEvent(baseData) {
    if (!eventSelect || !baseData) return baseData;
    
    const selectedEvent = eventSelect.value;
    let eventData = generateEventOverlayData(selectedEvent, baseData);
    eventData = applyCountryAndImpactFilters(eventData);
    
    // Update impact indicator
    updateImpactIndicator(selectedEvent);
    
    return eventData;
  }
  
  // Store full dataset globally for overview chart
  let fullDataset = null;
  let currentZoomRange = null;
  
  // Store original functions and enhance them
  const originalUpdateChart = window.updateChart;
  const originalRenderChart = window.renderChart;
  
  // Enhanced render function
  function enhancedRenderChart(data) {
    baseSearchData = data; // Store the base data
    
    // Store full dataset if not already stored or if this is a larger dataset
    if (!fullDataset || data.length > (fullDataset.length * 0.8)) {
      fullDataset = [...data];
    }
    
    // Store current zoom range
    if (data.length > 0) {
      currentZoomRange = {
        start: d3.min(data, d => d.date),
        end: d3.max(data, d => d.date)
      };
    }
    
    const enhancedData = updateVisualizationWithEvent(data);
    
    if (originalRenderChart && typeof originalRenderChart === 'function') {
      originalRenderChart.call(this, enhancedData);
    }
    
    // Make chart visible
    setTimeout(() => {
      const chartElement = document.getElementById('searchTrendChart');
      if (chartElement) {
        chartElement.classList.add('visible');
        chartElement.style.opacity = '1';
      }
    }, 100);
    
    // Always render overview chart with full dataset
    setTimeout(() => {
      renderOverviewChart(fullDataset || enhancedData);
    }, 200);
  }
  
  // Enhanced update function
  function enhancedUpdateChart(data) {
    if (!data || !Array.isArray(data)) return;
    
    // Store current zoom range
    if (data.length > 0) {
      currentZoomRange = {
        start: d3.min(data, d => d.date),
        end: d3.max(data, d => d.date)
      };
    }
    
    // Apply event overlay to the data
    const enhancedData = updateVisualizationWithEvent(data);
    
    // Call original update or render function
    if (originalUpdateChart && typeof originalUpdateChart === 'function') {
      originalUpdateChart.call(this, enhancedData);
    } else if (originalRenderChart && typeof originalRenderChart === 'function') {
      originalRenderChart.call(this, enhancedData);
    }
    
    // Always update overview chart with full dataset
    setTimeout(() => {
      renderOverviewChart(fullDataset || enhancedData);
    }, 200);
  }
  
  // Override global functions
  window.renderChart = enhancedRenderChart;
  window.updateChart = enhancedUpdateChart;
  
  function renderOverviewChart(data) {
    const overviewContainer = document.getElementById('overviewChart');
    if (!overviewContainer || !data || data.length === 0) return;
    
    // Always use full dataset for overview
    const overviewData = fullDataset || data;
    
    // Clear previous overview chart
    d3.select('#overviewChart').selectAll('*').remove();
    
    const margin = { top: 8, right: 15, bottom: 15, left: 15 };
    const containerWidth = overviewContainer.clientWidth || 800;
    const width = containerWidth - margin.left - margin.right;
    const height = 60 - margin.top - margin.bottom;
    
    const svg = d3.select('#overviewChart')
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', 60)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales for overview (always based on full dataset)
    const xScale = d3.scaleTime()
      .domain(d3.extent(overviewData, d => d.date))
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(overviewData, d => d.value))
      .range([height, 0]);
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Create area generator
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add area
    svg.append('path')
      .datum(overviewData)
      .attr('class', 'overview-area')
      .attr('d', area);
    
    // Add line
    svg.append('path')
      .datum(overviewData)
      .attr('class', 'overview-line')
      .attr('d', line);
    
    // Add selection indicator if we have current zoom range
    if (currentZoomRange && currentZoomRange.start && currentZoomRange.end) {
      const startX = xScale(currentZoomRange.start);
      const endX = xScale(currentZoomRange.end);
      
      // Add selection rectangle
      svg.append('rect')
        .attr('class', 'zoom-selection')
        .attr('x', startX)
        .attr('y', 0)
        .attr('width', Math.max(2, endX - startX))
        .attr('height', height)
        .style('fill', 'rgba(29, 155, 240, 0.3)')
        .style('stroke', '#1D9BF0')
        .style('stroke-width', '2px')
        .style('opacity', 0.8);
      
      // Add selection handles
      svg.append('rect')
        .attr('class', 'zoom-handle-left')
        .attr('x', startX - 2)
        .attr('y', -2)
        .attr('width', 4)
        .attr('height', height + 4)
        .style('fill', '#1D9BF0')
        .style('cursor', 'ew-resize');
      
      svg.append('rect')
        .attr('class', 'zoom-handle-right')
        .attr('x', endX - 2)
        .attr('y', -2)
        .attr('width', 4)
        .attr('height', height + 4)
        .style('fill', '#1D9BF0')
        .style('cursor', 'ew-resize');
    }
    
    // Create brush for zooming
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('brush end', function(event) {
        if (!event.selection) return;
        
        const [x0, x1] = event.selection;
        const domain = [xScale.invert(x0), xScale.invert(x1)];
        
        // Filter data based on brush selection
        const filteredData = overviewData.filter(d => d.date >= domain[0] && d.date <= domain[1]);
        
        if (filteredData.length > 0) {
          // Update current zoom range
          currentZoomRange = {
            start: domain[0],
            end: domain[1]
          };
          
          // Update main chart with filtered data
          updateMainChartWithBrush(filteredData);
        }
      });
    
    // Add brush
    const brushGroup = svg.append('g')
      .attr('class', 'brush')
      .call(brush);
    
    // Style brush
    brushGroup.select('.overlay')
      .style('cursor', 'crosshair');
    
    brushGroup.selectAll('.selection')
      .attr('class', 'overview-brush')
      .style('opacity', 0.1); // Make brush selection less prominent since we have our own indicator
    
    brushGroup.selectAll('.handle')
      .attr('class', 'overview-brush-handle')
      .style('width', '6px')
      .style('opacity', 0.3); // Make brush handles less prominent
  }
  
  function updateMainChartWithBrush(filteredData) {
    // Get the main chart SVG
    const mainSvg = d3.select('#searchTrendChart svg');
    if (mainSvg.empty()) return;
    
    // Update scales and redraw main chart with filtered data
    const chartContainer = document.getElementById('searchTrendChart');
    const margin = { top: 35, right: 50, bottom: 70, left: 60 };
    const containerWidth = Math.min(1100, chartContainer.clientWidth || 1000);
    const width = containerWidth - margin.left - margin.right;
    const height = 400;
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(filteredData, d => d.date))
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.value) * 1.15])
      .range([height, 0]);
    
    // Update line and area paths
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Update main chart paths with transition
    const g = mainSvg.select('g');
    
    g.select('.line-chart-area')
      .transition()
      .duration(300)
      .attr('d', area(filteredData));
    
    g.select('.line-chart-path')
      .transition()
      .duration(300)
      .attr('d', line(filteredData));
    
    // Update axes
    g.select('.chart-axis')
      .transition()
      .duration(300)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y')));
    
    g.selectAll('.chart-axis.y-axis')
      .transition()
      .duration(300)
      .call(d3.axisLeft(yScale));
    
    // Update dots
    const dots = g.selectAll('.chart-dot')
      .data(filteredData);
    
    dots.transition()
      .duration(300)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value));
    
    dots.enter()
      .append('circle')
      .attr('class', 'chart-dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 2);
    
    dots.exit().remove();
  }
  
  // Event handlers
  if (eventSelect) {
    eventSelect.addEventListener('change', () => {
      const selectedEvent = eventSelect.value;
      
      // Update impact indicator for any selection
      updateImpactIndicator(selectedEvent);
      
      // If no event selected (placeholder), show full chart
      if (!selectedEvent || selectedEvent === '') {
        renderChart(currentData);
        return;
      }
      
      // Find the event data for zoom and line marker functionality
      const eventData = eventsData[selectedEvent];
      
      if (eventData && eventData.zoomRange && eventData.showLine) {
        console.log('Zooming to event:', eventData.name);
        console.log('Zoom range:', eventData.zoomRange);
        
        // Zoom to the event's date range
        zoomToEvent(selectedEvent);
        return;
      }
      
      // Fallback for events without zoom/line functionality
      if (baseSearchData.length > 0) {
        const enhancedData = updateVisualizationWithEvent(baseSearchData);
        if (window.updateChart) {
          window.updateChart(enhancedData);
        }
      }
    });
  }
  
  if (countrySelect) {
    countrySelect.addEventListener('change', () => {
      if (baseSearchData.length > 0) {
        const enhancedData = updateVisualizationWithEvent(baseSearchData);
        if (window.updateChart) {
          window.updateChart(enhancedData);
        }
      }
    });
  }
  
  // Initialize with Trump Georgia Arrest event
  setTimeout(() => {
    // Set default impact indicator to neutral state (no event selected)
    if (impactFill && impactThumb && impactValue) {
      impactFill.style.width = '0%';
      impactThumb.style.left = '0%';
      impactValue.textContent = 'Select an event to see impact';
      impactFill.style.background = 'linear-gradient(90deg, #71767B, #1D9BF0)';
    }
    
    // Force chart visibility as fallback
    const chartElement = document.getElementById('searchTrendChart');
    if (chartElement) {
      chartElement.style.opacity = '1';
      chartElement.style.transform = 'translateY(0)';
      chartElement.classList.add('visible');
    }
    
    // Check if we have data and trigger rendering if needed
    if (baseSearchData.length > 0) {
      const enhancedData = updateVisualizationWithEvent(baseSearchData);
      if (window.renderChart) {
        window.renderChart(enhancedData);
      }
    }
  }, 500);
});

// ========================================
// ENHANCED SENTIMENT VISUALIZATIONS
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
  // Tab switching
  const tabs = document.querySelectorAll('.viz-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      const content = document.getElementById(tabName + 'Tab');
      if (content) content.classList.add('active');
    });
  });

  const sentimentData = {
    // Data calculated from gpo-ai_data.csv, column aipi2 (growth sentiment)
    // "Concerned about growth" = nervous, "Excited about growth" = excited
    'Argentina': { nervous: 36.7, excited: 37.1, count: 1372 },
    'Australia': { nervous: 57.8, excited: 18.6, count: 1107 },
    'Brazil': { nervous: 42.4, excited: 39.9, count: 1119 },
    'Canada': { nervous: 52.4, excited: 24.4, count: 1062 },
    'Chile': { nervous: 45.1, excited: 32.0, count: 1143 },
    'China': { nervous: 45.0, excited: 38.7, count: 1120 },
    'France': { nervous: 48.5, excited: 20.3, count: 1101 },
    'Germany': { nervous: 46.9, excited: 21.3, count: 1117 },
    'India': { nervous: 34.6, excited: 55.8, count: 1123 },
    'Indonesia': { nervous: 29.2, excited: 59.9, count: 1100 },
    'Italy': { nervous: 43.8, excited: 31.5, count: 1102 },
    'Japan': { nervous: 43.9, excited: 22.7, count: 1101 },
    'Kenya': { nervous: 48.2, excited: 46.2, count: 1167 },
    'Mexico': { nervous: 38.5, excited: 44.5, count: 1095 },
    'Pakistan': { nervous: 38.4, excited: 41.9, count: 1228 },
    'Poland': { nervous: 39.3, excited: 29.3, count: 1108 },
    'Portugal': { nervous: 55.6, excited: 27.0, count: 1102 },
    'South Africa': { nervous: 44.8, excited: 41.2, count: 1124 },
    'Spain': { nervous: 54.0, excited: 22.8, count: 1157 },
    'United Kingdom': { nervous: 57.5, excited: 19.8, count: 1133 },
    'United States': { nervous: 52.9, excited: 21.9, count: 1100 }
  };


  // Functions that let the sentiment bar chart control the globe.
  // They are assigned concrete implementations once the globe is initialised.
  let focusCountryOnGlobe = function(countryName) {};
  let stopGlobeRotation = function() {};

  const normalizeCountryName = (name) => {
    const nameMap = {
      'United States of America': 'United States',
      'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
      'UK': 'United Kingdom',
      'USA': 'United States'
    };
    return nameMap[name] || name;
  };


  // ========================================
  // SENTIMENT GAP BAR CHART - EXTRA LARGE & INTERACTIVE
  // ========================================
  const scatterContainer = document.getElementById('scatterChart');
  if (scatterContainer) {
    const margin = { top: 30, right: 30, bottom: 50, left: 180 };
    const containerWidth = scatterContainer.offsetWidth || 800;
    const containerHeight = scatterContainer.offsetHeight || 700;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Prepare data array with nervous–excited gap
    const dataArray = Object.entries(sentimentData).map(([country, d]) => ({
      country,
      excited: d.excited,
      nervous: d.nervous,
      count: d.count,
      gap: d.nervous - d.excited // positive = more nervous than excited
    }))
    // sort by gap descending (more nervous at top)
    .sort((a, b) => b.gap - a.gap);

    // Color scale shared with the globe (more nervous = redder)
    const nervousColorScale = d3.scaleSequential()
      .domain([25, 60])
      .interpolator(d3.interpolateRgb('#4AADFF', '#FF4444'));

    // Clear any previous chart
    scatterContainer.innerHTML = '';

    const svg = d3.select('#scatterChart')
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxAbsGap = d3.max(dataArray, d => Math.abs(d.gap)) || 0;

    const xScale = d3.scaleLinear()
      .domain([-maxAbsGap, maxAbsGap])
      .range([0, width])
      .nice();

    const yScale = d3.scaleBand()
      .domain(dataArray.map(d => d.country))
      .range([0, height])
      .padding(0.25);

    // Zero line
    svg.append('line')
      .attr('class', 'gap-zero-line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', 'rgba(231,233,234,0.4)')
      .style('stroke-width', 1.5)
      .style('stroke-dasharray', '4,4');

    // Grid lines
    svg.append('g')
      .attr('class', 'gap-x-grid')
      .call(
        d3.axisTop(xScale)
          .ticks(7)
          .tickSize(-height)
          .tickFormat(d => (d === 0 ? '' : (d > 0 ? '+' + d.toFixed(0) : d.toFixed(0))))
      )
      .selectAll('line')
      .style('stroke', 'rgba(231,233,234,0.15)')
      .style('stroke-dasharray', '3,6');

    svg.selectAll('.gap-x-grid .domain').remove();

    // Bars
    const bars = svg.selectAll('.gap-bar')
      .data(dataArray)
      .enter()
      .append('rect')
      .attr('class', 'gap-bar')
      .attr('y', d => yScale(d.country))
      .attr('x', xScale(0))
      .attr('height', yScale.bandwidth())
      .attr('width', 0)
      .attr('rx', 8)
      .style('fill', d => nervousColorScale(d.nervous))
      .style('opacity', 0.9);

    bars.transition()
      .duration(900)
      .delay((d, i) => i * 20)
      .attr('x', d => xScale(Math.min(0, d.gap)))
      .attr('width', d => Math.abs(xScale(d.gap) - xScale(0)));

    // Add hover effects and click interactivity to bars
    bars
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('rx', 10)
          .style('filter', 'brightness(1.2)');
      })
      .on('mouseleave', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('rx', 8)
          .style('filter', 'brightness(1)');
      });

    // Country labels
    svg.append('g')
      .attr('class', 'gap-y-axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', '#E7E9EA')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('cursor', 'pointer');

    svg.selectAll('.gap-y-axis .domain, .gap-y-axis line').remove();

    // Gap labels at bar ends
    svg.selectAll('.gap-label')
      .data(dataArray)
      .enter()
      .append('text')
      .attr('class', 'gap-label')
      .attr('y', d => yScale(d.country) + yScale.bandwidth() / 2 + 4)
      .attr('x', d => d.gap >= 0 ? xScale(d.gap) + 8 : xScale(d.gap) - 8)
      .attr('text-anchor', d => d.gap >= 0 ? 'start' : 'end')
      .style('fill', '#E7E9EA')
      .style('font-size', '13px')
      .style('font-weight', '700')
      .style('opacity', 0.9)
      .text(d => `${d.gap >= 0 ? '+' : ''}${d.gap.toFixed(1)} pts`);

    // Axis titles
    svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('fill', '#E7E9EA')
      .style('font-size', '13px')
      .style('font-weight', '700')
      .text('Sentiment gap (Nervous − Excited, percentage points)');

    svg.append('text')
      .attr('class', 'axis-label-left')
      .attr('x', xScale(-maxAbsGap))
      .attr('y', -18)
      .attr('text-anchor', 'start')
      .style('fill', '#4AADFF')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('More excited about AI');

    svg.append('text')
      .attr('class', 'axis-label-right')
      .attr('x', xScale(maxAbsGap))
      .attr('y', -18)
      .attr('text-anchor', 'end')
      .style('fill', '#FF6B6B')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('More nervous about AI');

    // Tooltip (re-use if it already exists)
    let gapTooltip = d3.select('body').select('.chart-tooltip');
    if (gapTooltip.empty()) {
      gapTooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip');
    }

    bars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .style('opacity', 1);

        const direction = d.gap >= 0 ? 'more nervous than excited' : 'more excited than nervous';

        gapTooltip
          .html(`
            <div class="tooltip-date">${d.country}</div>
            <div class="tooltip-value">
              Nervous: <strong>${d.nervous.toFixed(1)}%</strong><br/>
              Excited: <strong>${d.excited.toFixed(1)}%</strong><br/>
              Gap: <strong>${d.gap >= 0 ? '+' : ''}${d.gap.toFixed(1)} pts</strong><br/>
            </div>
            <div style="margin-top: 0.6rem; font-size: 0.9rem;">
              People here are <strong>${Math.abs(d.gap).toFixed(1)} points ${direction}</strong> about AI.<br/>
              <span style="opacity:0.8;">Respondents: ${d.count.toLocaleString()}</span>
            </div>
          `)
          .style('opacity', 1)
          .classed('visible', true);

        positionTooltip(gapTooltip, event.pageX, event.pageY, 15, 24);
      })
      .on('mousemove', function(event) {
        positionTooltip(gapTooltip, event.pageX, event.pageY, 15, 24);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .style('opacity', 0.9);

        gapTooltip
          .classed('visible', false)
          .style('opacity', 0);
      })
      .on('click', function(event, d) {
        // Clicking a bar recenters the globe on that country and stops the spin
        globeSpinLocked = true;
        if (typeof stopGlobeRotation === 'function') {
          stopGlobeRotation();
        }
        if (typeof focusCountryOnGlobe === 'function') {
          focusCountryOnGlobe(d.country);
        }
      });

    // SORT BUTTON FUNCTIONALITY
    let currentSortMode = 'gap'; // Track current sort mode
    
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button
        sortButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const sortType = this.getAttribute('data-sort');
        currentSortMode = sortType;
        let sortedData;

        switch(sortType) {
          case 'gap':
            sortedData = [...dataArray].sort((a, b) => b.gap - a.gap);
            break;
          case 'nervous':
            sortedData = [...dataArray].sort((a, b) => b.nervous - a.nervous);
            break;
          case 'excited':
            sortedData = [...dataArray].sort((a, b) => b.excited - a.excited);
            break;
          case 'country':
            sortedData = [...dataArray].sort((a, b) => a.country.localeCompare(b.country));
            break;
          default:
            sortedData = dataArray;
        }

        // Update yScale domain with new order
        yScale.domain(sortedData.map(d => d.country));

        // Update xScale based on sort mode
        let maxValue;
        if (sortType === 'nervous') {
          maxValue = d3.max(sortedData, d => d.nervous);
          xScale.domain([0, maxValue]).nice();
        } else if (sortType === 'excited') {
          maxValue = d3.max(sortedData, d => d.excited);
          xScale.domain([0, maxValue]).nice();
        } else if (sortType === 'country') {
          maxValue = Math.max(d3.max(sortedData, d => d.nervous), d3.max(sortedData, d => d.excited));
          xScale.domain([0, maxValue]).nice();
        } else {
          // gap mode
          const maxAbsGap = d3.max(sortedData, d => Math.abs(d.gap)) || 0;
          xScale.domain([-maxAbsGap, maxAbsGap]).nice();
        }

        // Update zero line position
        svg.select('.gap-zero-line')
          .transition()
          .duration(750)
          .attr('x1', xScale(0))
          .attr('x2', xScale(0));

        // Update grid
        svg.select('.gap-x-grid')
          .transition()
          .duration(750)
          .call(
            d3.axisTop(xScale)
              .ticks(7)
              .tickSize(-height)
              .tickFormat(d => {
                if (sortType === 'gap') {
                  return d === 0 ? '' : (d > 0 ? '+' + d.toFixed(0) : d.toFixed(0));
                } else {
                  return d.toFixed(0) + '%';
                }
              })
          );

        svg.selectAll('.gap-x-grid .domain').remove();
        svg.selectAll('.gap-x-grid line')
          .style('stroke', 'rgba(231,233,234,0.15)')
          .style('stroke-dasharray', '3,6');

        // Determine bar color scale based on sort mode
        let getBarColor;
        if (sortType === 'nervous') {
          getBarColor = d => nervousColorScale(d.nervous);
        } else if (sortType === 'excited') {
          const excitedColorScale = d3.scaleSequential()
            .domain([60, 25])
            .interpolator(d3.interpolateRgb('#4AADFF', '#FF4444'));
          getBarColor = d => excitedColorScale(d.excited);
        } else if (sortType === 'country') {
          getBarColor = d => nervousColorScale(d.nervous);
        } else {
          getBarColor = d => nervousColorScale(d.nervous);
        }

        // Rebind data and transition bars
        svg.selectAll('.gap-bar')
          .data(sortedData, d => d.country)
          .transition()
          .duration(750)
          .attr('y', d => yScale(d.country))
          .attr('x', d => {
            if (sortType === 'gap') {
              return xScale(Math.min(0, d.gap));
            } else {
              return xScale(0);
            }
          })
          .attr('width', d => {
            if (sortType === 'nervous') {
              return xScale(d.nervous) - xScale(0);
            } else if (sortType === 'excited') {
              return xScale(d.excited) - xScale(0);
            } else if (sortType === 'country') {
              return xScale(d.nervous) - xScale(0);
            } else {
              return Math.abs(xScale(d.gap) - xScale(0));
            }
          })
          .style('fill', getBarColor);

        // Rebind data and transition labels
        svg.selectAll('.gap-label')
          .data(sortedData, d => d.country)
          .transition()
          .duration(750)
          .attr('y', d => yScale(d.country) + yScale.bandwidth() / 2 + 4)
          .attr('x', d => {
            if (sortType === 'nervous') {
              return xScale(d.nervous) + 8;
            } else if (sortType === 'excited') {
              return xScale(d.excited) + 8;
            } else if (sortType === 'country') {
              return xScale(d.nervous) + 8;
            } else {
              return d.gap >= 0 ? xScale(d.gap) + 8 : xScale(d.gap) - 8;
            }
          })
          .attr('text-anchor', d => {
            if (sortType === 'gap' && d.gap < 0) {
              return 'end';
            } else {
              return 'start';
            }
          })
          .text(d => {
            if (sortType === 'nervous') {
              return `${d.nervous.toFixed(1)}%`;
            } else if (sortType === 'excited') {
              return `${d.excited.toFixed(1)}%`;
            } else if (sortType === 'country') {
              return `${d.nervous.toFixed(1)}%`;
            } else {
              return `${d.gap >= 0 ? '+' : ''}${d.gap.toFixed(1)} pts`;
            }
          });

        // Update y-axis with new order
        svg.select('.gap-y-axis')
          .transition()
          .duration(750)
          .call(d3.axisLeft(yScale));

        svg.selectAll('.gap-y-axis .domain, .gap-y-axis line').remove();
        svg.selectAll('.gap-y-axis text')
          .style('fill', '#E7E9EA')
          .style('font-size', '14px')
          .style('font-weight', '600')
          .style('cursor', 'pointer');

        // Update axis title
        svg.select('.axis-title')
          .transition()
          .duration(750)
          .text(() => {
            if (sortType === 'nervous') {
              return 'Percentage of people nervous about AI';
            } else if (sortType === 'excited') {
              return 'Percentage of people excited about AI';
            } else if (sortType === 'country') {
              return 'Percentage of people nervous about AI';
            } else {
              return 'Sentiment gap (Nervous − Excited, percentage points)';
            }
          });

        // Update top labels
        svg.selectAll('.axis-label-left, .axis-label-right').remove();
        
        if (sortType === 'gap') {
          svg.append('text')
            .attr('class', 'axis-label-left')
            .attr('x', xScale(-maxAbsGap))
            .attr('y', -18)
            .attr('text-anchor', 'start')
            .style('fill', '#4AADFF')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('opacity', 0)
            .text('More excited about AI')
            .transition()
            .duration(750)
            .style('opacity', 1);

          svg.append('text')
            .attr('class', 'axis-label-right')
            .attr('x', xScale(maxAbsGap))
            .attr('y', -18)
            .attr('text-anchor', 'end')
            .style('fill', '#FF6B6B')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('opacity', 0)
            .text('More nervous about AI')
            .transition()
            .duration(750)
            .style('opacity', 1);
        } else if (sortType === 'excited') {
          svg.append('text')
            .attr('class', 'axis-label-right')
            .attr('x', xScale(maxValue))
            .attr('y', -18)
            .attr('text-anchor', 'end')
            .style('fill', '#4AADFF')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('opacity', 0)
            .text('More excited about AI')
            .transition()
            .duration(750)
            .style('opacity', 1);
        } else if (sortType === 'nervous' || sortType === 'country') {
          svg.append('text')
            .attr('class', 'axis-label-right')
            .attr('x', xScale(maxValue || d3.max(sortedData, d => d.nervous)))
            .attr('y', -18)
            .attr('text-anchor', 'end')
            .style('fill', '#FF6B6B')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('opacity', 0)
            .text('More nervous about AI')
            .transition()
            .duration(750)
            .style('opacity', 1);
        }

        // Update globe colors to match sort mode
        if (typeof countryPaths !== 'undefined' && countryPaths) {
          countryPaths
            .transition()
            .duration(750)
            .attr('fill', d => {
              const data = sentimentData[normalizeCountryName(d.properties.name)];
              if (!data) return '#2d3748';
              
              if (sortType === 'excited') {
                const excitedColorScale = d3.scaleSequential()
                  .domain([60, 25])
                  .interpolator(d3.interpolateRgb('#4AADFF', '#FF4444'));
                return excitedColorScale(data.excited);
              } else {
                return nervousColorScale(data.nervous);
              }
            });
        }

        // Update color legend
        const legendExcited = document.querySelector('.legend-end.excited-end');
        const legendConcerned = document.querySelector('.legend-end.concerned-end');
        
        if (sortType === 'excited') {
          if (legendExcited) legendExcited.textContent = 'Less Excited';
          if (legendConcerned) legendConcerned.textContent = 'More Excited';
        } else if (sortType === 'nervous' || sortType === 'country') {
          if (legendExcited) legendExcited.textContent = 'Less Concerned';
          if (legendConcerned) legendConcerned.textContent = 'More Concerned';
        } else {
          // gap mode
          if (legendExcited) legendExcited.textContent = 'More Excited';
          if (legendConcerned) legendConcerned.textContent = 'More Concerned';
        }
      });
    });
  }

  // GLOBE MAP - ROTATING ORTHOGRAPHIC VIEW
  // ========================================
  const mapContainer = document.getElementById('worldMap');
  if (!mapContainer) return;

  const mapWidth = mapContainer.offsetWidth || 800;
  const mapHeight = mapContainer.offsetHeight || 700;
  const globeSvg = d3.select('#worldMap').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('background', '#000000');

  // Tooltip with vertical bar chart inside
  const mapTooltip = d3.select('body')
    .append('div')
    .attr('class', 'map-tooltip')
    .style('position', 'fixed')
    .style('opacity', 0);
  // Hide tooltip if the cursor leaves the map entirely
  globeSvg.on('mouseleave', () => {
    mapTooltip.classed('visible', false).style('opacity', 0);
  });
  const mapDom = document.getElementById('worldMap');
  if (mapDom) {
    mapDom.addEventListener('mouseleave', () => {
      mapTooltip.classed('visible', false).style('opacity', 0);
    });
  }

  // Orthographic (3D-style) projection
  const projection = d3.geoOrthographic()
    .scale(mapHeight / 2.1)
    .translate([mapWidth * 0.52, mapHeight * 0.5])
    .clipAngle(90);

  const path = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule();

  const globeGroup = globeSvg.append('g').attr('class', 'globe-group');

  // Soft glow behind globe
  const defs = globeSvg.append('defs');
  const glow = defs.append('radialGradient')
    .attr('id', 'globe-glow')
    .attr('cx', '50%')
    .attr('cy', '50%');
  glow.append('stop').attr('offset', '0%').attr('stop-color', '#1f2933').attr('stop-opacity', 0.9);
  glow.append('stop').attr('offset', '70%').attr('stop-color', '#020617').attr('stop-opacity', 1);
  glow.append('stop').attr('offset', '100%').attr('stop-color', '#020617').attr('stop-opacity', 0);

  globeGroup.append('circle')
    .attr('cx', mapWidth * 0.52)
    .attr('cy', mapHeight * 0.5)
    .attr('r', mapHeight / 2.2)
    .attr('fill', 'url(#globe-glow)');

  const sphere = globeGroup.append('path')
    .datum({ type: 'Sphere' })
    .attr('class', 'globe-sphere')
    .attr('fill', '#020617')
    .attr('stroke', '#020617')
    .attr('stroke-width', 1)
    .attr('d', path);

  const graticulePath = globeGroup.append('path')
    .datum(graticule())
    .attr('class', 'globe-graticule')
    .attr('fill', 'none')
    .attr('stroke', 'rgba(148,163,184,0.25)')
    .attr('stroke-width', 0.5)
    .attr('d', path);

  // Color scale shared with main bar chart (more nervous = redder)
  const nervousColorScale = d3.scaleSequential()
    .domain([25, 60])
    .interpolator(d3.interpolateRgb('#4AADFF', '#FF4444'));

  let countryFeatures = [];
  let countryPaths;

  function redrawGlobe() {
    if (!countryPaths) return;
    sphere.attr('d', path);
    graticulePath.attr('d', path(graticule()));
    countryPaths.attr('d', path);
  }

  let globeTimer = null;
  let globeSpinLocked = false; // set true when a user click should keep the globe paused
  function startGlobeRotation() {
    if (globeSpinLocked || globeTimer) return; // Already spinning or intentionally paused
    globeTimer = d3.timer((elapsed) => {
      const rotation = projection.rotate();
      // slow, steady spin ~ one full rotation per 35–40 seconds
      const lambda = rotation[0] + 0.25; // Increased from 0.01 for more visible rotation
      projection.rotate([lambda, rotation[1], rotation[2]]);
      redrawGlobe();
    });
  }

  function stopGlobeRotationFn() {
    if (globeTimer) {
      globeTimer.stop();
      globeTimer = null;
    }
  }

  // Load world geometry and draw globe
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(world => {
    countryFeatures = topojson.feature(world, world.objects.countries).features;

    countryPaths = globeGroup.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(countryFeatures)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', d => {
        const data = sentimentData[normalizeCountryName(d.properties.name)];
        return data ? nervousColorScale(data.nervous) : '#2d3748';
      })
      .attr('stroke', '#020617')
      .attr('stroke-width', 0.4)
      .style('opacity', d => sentimentData[normalizeCountryName(d.properties.name)] ? 0.96 : 0.4)
      .style('pointer-events', d => sentimentData[normalizeCountryName(d.properties.name)] ? 'auto' : 'none');

    // Hover tooltip with tiny vertical bar chart
    countryPaths
      .on('mouseover', function(event, d) {
        const data = sentimentData[normalizeCountryName(d.properties.name)];
        if (!data) return;

        d3.select(this)
          .raise()
          .transition()
          .duration(150)
          .attr('stroke-width', 0.9)
          .style('opacity', 1);

        const maxBarHeight = 70;
        const excitedHeight = (data.excited / 100) * maxBarHeight;
        const nervousHeight = (data.nervous / 100) * maxBarHeight;

        const excitedCount = Math.round(data.count * data.excited / 100);
        const nervousCount = Math.round(data.count * data.nervous / 100);

        mapTooltip
          .html(`
            <div class="country-name">${d.properties.name}</div>
            <div class="tooltip-bars">
              <div class="tooltip-bar-column">
                <div class="tooltip-bar excited" style="height:${excitedHeight}px;"></div>
                <div class="tooltip-bar-label">Excited</div>
                <div class="tooltip-bar-value">${data.excited.toFixed(1)}%</div>
                <div class="tooltip-bar-count">${excitedCount.toLocaleString()} people</div>
              </div>
              <div class="tooltip-bar-column">
                <div class="tooltip-bar nervous" style="height:${nervousHeight}px;"></div>
                <div class="tooltip-bar-label">Nervous</div>
                <div class="tooltip-bar-value">${data.nervous.toFixed(1)}%</div>
                <div class="tooltip-bar-count">${nervousCount.toLocaleString()} people</div>
              </div>
            </div>
          `)
          .classed('visible', true)
          .style('opacity', 1);

        positionTooltip(mapTooltip, event.pageX, event.pageY, 15, 28);
      })
      .on('mousemove', function(event) {
        positionTooltip(mapTooltip, event.pageX, event.pageY, 15, 28);
      })
      .on('mouseout', function() {
        const data = sentimentData[normalizeCountryName(d3.select(this).datum().properties.name)];
        if (!data) return;
        
        d3.select(this)
          .transition()
          .duration(150)
          .attr('stroke-width', 0.4)
          .style('opacity', 0.96);

        mapTooltip.classed('visible', false).style('opacity', 0);
      });

    // Expose functions so the bar chart can control the globe
    focusCountryOnGlobe = function(countryName) {
      if (!countryFeatures.length) return;
      const target = countryFeatures.find(f => normalizeCountryName(f.properties.name) === normalizeCountryName(countryName));
      if (!target) return;

      const centroid = d3.geoCentroid(target); // [lon, lat]
      stopGlobeRotation();

      // Reset all country strokes first
      countryPaths.style('stroke-width', 0.4).style('stroke', '#020617');

      // Find and highlight the target country path
      const targetIndex = countryFeatures.findIndex(f => f === target);
      if (targetIndex !== -1) {
        d3.select(countryPaths.nodes()[targetIndex])
          .style('stroke-width', 2)
          .style('stroke', '#1D9BF0');
      }

      d3.transition()
        .duration(1250)
        .tween('rotate', () => {
          const initialRotate = projection.rotate();
          const targetRotate = [-centroid[0], -centroid[1], 0];
          const r = d3.interpolate(initialRotate, targetRotate);
          return t => {
            projection.rotate(r(t));
            redrawGlobe();
          };
        })
        .on('end', () => {
          if (!globeSpinLocked) startGlobeRotation();
        });
    };

    stopGlobeRotation = stopGlobeRotationFn;

    // Add drag behavior to rotate globe
    const drag = d3.drag()
      .on('start', function(event) {
        globeSpinLocked = true;
        stopGlobeRotation();
        globeSvg.style('cursor', 'grabbing');
      })
      .on('drag', function(event) {
        const rotation = projection.rotate();
        const sensitivity = 0.5;
        projection.rotate([
          rotation[0] + event.dx * sensitivity,
          rotation[1] - event.dy * sensitivity,
          rotation[2]
        ]);
        redrawGlobe();
      })
      .on('end', function(event) {
        globeSvg.style('cursor', 'grab');
        // Resume rotation after 2 seconds of no interaction
        setTimeout(() => {
          globeSpinLocked = false;
          startGlobeRotation();
        }, 2000);
      });

    globeSvg.call(drag);

    // Add click on countries to highlight them and show in bar chart
    countryPaths.on('click', function(event, d) {
      const countryName = normalizeCountryName(d.properties.name);
      const data = sentimentData[countryName];
      if (!data) return;

      // Stop rotation and lock on this country
      globeSpinLocked = true;
      stopGlobeRotation();

      // Highlight this country
      countryPaths.style('stroke-width', 0.4);
      d3.select(this)
        .style('stroke-width', 2)
        .style('stroke', '#1D9BF0');

      // Pulse effect
      d3.select(this)
        .transition()
        .duration(300)
        .style('opacity', 1)
        .transition()
        .duration(300)
        .style('opacity', 0.96);
    });

    // Keyboard shortcuts for globe interaction
    document.addEventListener('keydown', (event) => {
      const sentimentSection = document.getElementById('sectionSentiment');
      if (!sentimentSection) return;
      
      // Only respond if sentiment section is in view
      const rect = sentimentSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      const rotation = projection.rotate();
      const step = 5;

      switch(event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          globeSpinLocked = true;
          stopGlobeRotation();
          projection.rotate([rotation[0] - step, rotation[1], rotation[2]]);
          redrawGlobe();
          break;
        case 'ArrowRight':
          event.preventDefault();
          globeSpinLocked = true;
          stopGlobeRotation();
          projection.rotate([rotation[0] + step, rotation[1], rotation[2]]);
          redrawGlobe();
          break;
        case 'ArrowUp':
          event.preventDefault();
          globeSpinLocked = true;
          stopGlobeRotation();
          projection.rotate([rotation[0], Math.min(90, rotation[1] + step), rotation[2]]);
          redrawGlobe();
          break;
        case 'ArrowDown':
          event.preventDefault();
          globeSpinLocked = true;
          stopGlobeRotation();
          projection.rotate([rotation[0], Math.max(-90, rotation[1] - step), rotation[2]]);
          redrawGlobe();
          break;
        case 'r':
        case 'R':
          // Reset to default view and resume rotation
          event.preventDefault();
          globeSpinLocked = false;
          d3.transition()
            .duration(1000)
            .tween('rotate', () => {
              const initialRotate = projection.rotate();
              const targetRotate = [0, 0, 0];
              const r = d3.interpolate(initialRotate, targetRotate);
              return t => {
                projection.rotate(r(t));
                redrawGlobe();
              };
            })
            .on('end', () => {
              startGlobeRotation();
            });
          break;
      }
    });

    // Start slow spin and keep it tied to the sentiment section visibility
    const sentimentSection = document.getElementById('sectionSentiment');
    if (sentimentSection) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!globeSpinLocked) startGlobeRotation();
          } else {
            stopGlobeRotation();
          }
        });
      }, { threshold: 0.25 });
      sectionObserver.observe(sentimentSection);
    } else {
      startGlobeRotation();
    }
  }).catch((error) => {
    console.error('Error loading map data:', error);
    mapContainer.innerHTML =
      '<p style="color: #E7E9EA; text-align: center; padding: 2rem; font-size:18px;">' +
      'Map visualization could not be loaded. Please check your internet connection.</p>';
  });

  // Add view toggle functionality
  const viewButtons = document.querySelectorAll('.sentiment-control-btn');
  const chartPanel = document.querySelector('.sentiment-gap-panel');
  const globePanel = document.querySelector('.sentiment-globe-panel');

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active button
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Toggle visibility with smooth transition
      if (view === 'both') {
        chartPanel.style.display = 'flex';
        globePanel.style.display = 'flex';
        document.querySelector('.sentiment-layout').style.gridTemplateColumns = '1fr 1fr';
      } else if (view === 'chart') {
        chartPanel.style.display = 'flex';
        globePanel.style.display = 'none';
        document.querySelector('.sentiment-layout').style.gridTemplateColumns = '1fr';
      } else if (view === 'globe') {
        chartPanel.style.display = 'none';
        globePanel.style.display = 'flex';
        document.querySelector('.sentiment-layout').style.gridTemplateColumns = '1fr';
      }
    });
  });

// ========================================
// BOSTON ZOOM TRANSITION ANIMATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
  const bostonSection = document.getElementById('bostonTransition');
  if (!bostonSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBostonZoom();
        observer.unobserve(entry.target);
      }
    });

      // ========================================
      // Binary rain for #sectionHacker
      // Inserts a full-size canvas into the hacker section and animates falling 0/1 characters
      // ========================================
      function initBinaryRain() {
        const section = document.getElementById('sectionHacker');
        if (!section) return;
        // avoid creating multiple canvases
        if (section.querySelector('.hacker-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'hacker-canvas';
        // insert behind the visible text but inside the section
        section.insertBefore(canvas, section.firstChild);
        const ctx = canvas.getContext('2d');

        let width, height, columns, fontSize = 14, drops = [];

        function resize() {
          width = canvas.width = Math.max(300, section.clientWidth);
          height = canvas.height = Math.max(200, section.clientHeight);
          // font size scales a little with width on larger screens
          fontSize = Math.max(10, Math.round(width / 120));
          ctx.font = fontSize + 'px monospace';
          columns = Math.floor(width / fontSize);
          drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * height / fontSize));
        }

        resize();
        window.addEventListener('resize', () => {
          resize();
        });

        // draw loop
        function draw() {
          // translucent black to create trailing effect
          ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
          ctx.fillRect(0, 0, width, height);

          for (let i = 0; i < columns; i++) {
            const char = Math.random() > 0.5 ? '0' : '1';
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // occasional color variance for visual interest
            if (i % 17 === 0) {
              ctx.fillStyle = '#b266ff'; // purple streaks
            } else if (i % 13 === 0) {
              ctx.fillStyle = '#4AADFF'; // blue streaks
            } else {
              ctx.fillStyle = '#00ff66'; // neon green rain
            }

            ctx.fillText(char, x, y);

            // advance drop with a bit of randomness
            drops[i] = drops[i] + 1 + Math.random() * 0.6;

            // occasionally restart drop near top
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
              drops[i] = 0;
            }
          }

          requestAnimationFrame(draw);
        }

        // initialize background to solid transparent so first frame draws cleanly
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, width, height);
        requestAnimationFrame(draw);
      }

      // Start when DOM is ready. If this script is loaded at bottom of body it's fine too.
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBinaryRain);
      } else {
        initBinaryRain();
      }
  }, { threshold: 0.3 });

  observer.observe(bostonSection);

  async function animateBostonZoom() {
    const svg = d3.select('#bostonMapSvg');
    const width = document.getElementById('bostonZoom').offsetWidth;
    const height = document.getElementById('bostonZoom').offsetHeight;

    svg.attr('width', width).attr('height', height);

    try {
      const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      const countries = topojson.feature(world, world.objects.countries);

      // Start with world view
      const initialProjection = d3.geoNaturalEarth1()
        .scale(width / 5)
        .translate([width / 2, height / 2]);

      // Boston coordinates: 42.3601° N, 71.0589° W
      const bostonCoords = [-71.0589, 42.3601];
      
      // Zoom to Boston
      const zoomedProjection = d3.geoNaturalEarth1()
        .scale(width * 4)
        .center(bostonCoords)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(initialProjection);

      // Draw countries
      svg.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#1a1a1a')
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5);

      // Add a marker for Boston
      const bostonMarker = svg.append('circle')
        .attr('cx', initialProjection(bostonCoords)[0])
        .attr('cy', initialProjection(bostonCoords)[1])
        .attr('r', 0)
        .attr('fill', '#1D9BF0')
        .attr('opacity', 0);

      // Animate zoom to Boston
      setTimeout(() => {
        svg.selectAll('path')
          .transition()
          .duration(3500)
          .ease(d3.easeCubicInOut)
          .attrTween('d', function(d) {
            return function(t) {
              // Smooth interpolation for zoom
              const scale = width / 5 + t * (width * 4 - width / 5);
              const centerLon = 0 * (1 - t) + bostonCoords[0] * t;
              const centerLat = 0 * (1 - t) + bostonCoords[1] * t;
              
              const projection = d3.geoNaturalEarth1()
                .scale(scale)
                .center([centerLon, centerLat])
                .translate([width / 2, height / 2]);
              return d3.geoPath().projection(projection)(d);
            };
          });

        // Show and grow Boston marker with smooth animation
        bostonMarker
          .transition()
          .delay(2200)
          .duration(1000)
          .ease(d3.easeBackOut.overshoot(1.5))
          .attr('r', 15)
          .attr('opacity', 1)
          .attr('cx', width / 2)
          .attr('cy', height / 2);

        // Smoother pulse effect
        bostonMarker
          .transition()
          .delay(3200)
          .duration(800)
          .ease(d3.easeSinInOut)
          .attr('r', 25)
          .attr('opacity', 0.5)
          .transition()
          .duration(800)
          .ease(d3.easeSinInOut)
          .attr('r', 15)
          .attr('opacity', 1);

        // Show text labels with fade-in
        d3.select('#bostonLabel')
          .transition()
          .delay(2800)
          .duration(1000)
          .ease(d3.easeCubicOut)
          .style('opacity', 1);

        d3.select('#zoomingText')
          .transition()
          .delay(3200)
          .duration(1000)
          .ease(d3.easeCubicOut)
          .style('opacity', 0.9);
      }, 300);

    } catch (error) {
      console.error('Error loading Boston map:', error);
    }
  }
});




// ===== Scoped Binary Rain for #sectionHacker =====
(function () {
  const section = document.getElementById('sectionHacker');
  if (!section) return;

  const canvas = document.getElementById('hackerMatrix') || (() => {
    const c = document.createElement('canvas');
    c.id = 'hackerMatrix';
    section.prepend(c);
    return c;
  })();
  const ctx = canvas.getContext('2d');

  const glyphs = '01';
  const bgFade = 0.08;
  const color = '#00ff00';
  const baseFont = 16;
  let running = false;
  let rafId = null;
  let drops = [];
  let fontSize = baseFont;
  let cols = 0;

  function resizeMatrix() {
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const { width, height } = section.getBoundingClientRect();
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    fontSize = Math.max(12, Math.round(baseFont));
    cols = Math.max(1, Math.floor(width / fontSize));
    drops = new Array(cols).fill(1);
    ctx.font = fontSize + 'px monospace';
  }

  function tick() {
    if (!running) return;
    const { width, height } = section.getBoundingClientRect();
    ctx.fillStyle = `rgba(0, 0, 0, ${bgFade})`;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    for (let i = 0; i < drops.length; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(char, x, y);
      if (y > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    rafId = setTimeout(tick, 35)
  }

  function start() {
    if (running) return;
    running = true;
    resizeMatrix();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) clearTimeout(rafId);  // changed from cancelAnimationFrame
    rafId = null;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target !== section) return;
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.35 }
  );
  io.observe(section);

  const ro = new ResizeObserver(resizeMatrix);
  ro.observe(section);
  window.addEventListener('resize', resizeMatrix);
  window.addEventListener('orientationchange', resizeMatrix);
})();

// ========================================
// CLICKABLE CARDS FUNCTIONALITY - MOVED TO END
// ========================================
function initializeClickableCards() {
  console.log('🎯 Initializing clickable cards...');
  
  // Find all clickable cards in the conclusion section
  const clickableCards = document.querySelectorAll('.clickable-card');
  console.log('🔍 Found clickable cards:', clickableCards.length);
  
  if (clickableCards.length === 0) {
    console.warn('⚠️ No clickable cards found! Retrying in 1 second...');
    setTimeout(initializeClickableCards, 1000);
    return;
  }
  
  clickableCards.forEach((card, index) => {
    console.log(`🎨 Setting up card ${index}:`, card);
    
    const expandedContent = card.querySelector('.card-expanded-content');
    const cardHint = card.querySelector('.card-hint');
    
    console.log('📄 Expanded content:', expandedContent);
    console.log('💡 Card hint:', cardHint);
    
    if (expandedContent && cardHint) {
      // Initially hide expanded content
      expandedContent.style.display = 'none';
      expandedContent.style.maxHeight = '0';
      expandedContent.style.opacity = '0';
      expandedContent.style.overflow = 'hidden';
      expandedContent.style.transition = 'all 0.3s ease-in-out';
      
      let isExpanded = false;
      
      // Add click event listener
      card.addEventListener('click', function(e) {
        console.log('🖱️ Card clicked!', card);
        e.preventDefault();
        e.stopPropagation();
        
        if (!isExpanded) {
          console.log('📈 Expanding card...');
          // Expand the card
          expandedContent.style.display = 'block';
          expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
          expandedContent.style.opacity = '1';
          expandedContent.style.marginTop = '1rem';
          
          // Update hint text
          cardHint.textContent = 'Click to collapse';
          
          // Add expanded class for additional styling
          card.classList.add('expanded');
          
        } else {
          console.log('📉 Collapsing card...');
          // Collapse the card
          expandedContent.style.maxHeight = '0';
          expandedContent.style.opacity = '0';
          expandedContent.style.marginTop = '0';
          
          // Update hint text
          const isDetailsCard = card.querySelector('.answer-verdict');
          cardHint.textContent = isDetailsCard ? 'Click for details' : 'Click for tips';
          
          // Remove expanded class
          card.classList.remove('expanded');
          
          // Hide after animation completes
          setTimeout(() => {
            if (!isExpanded) {
              expandedContent.style.display = 'none';
            }
          }, 300);
        }
        
        isExpanded = !isExpanded;
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', function() {
        card.style.transform = 'translateY(-2px)';
        card.style.cursor = 'pointer';
        console.log('🎯 Card hover enter');
      });
      
      card.addEventListener('mouseleave', function() {
        if (!card.classList.contains('expanded')) {
          card.style.transform = 'translateY(0)';
        }
        console.log('🎯 Card hover leave');
      });
      
      console.log('✅ Card setup complete for card', index);
    } else {
      console.log('❌ Missing elements for card:', card);
      console.log('  - expandedContent:', expandedContent);
      console.log('  - cardHint:', cardHint);
    }
  });
  
  console.log('🎉 Clickable cards initialization complete!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeClickableCards);

// Also initialize after a delay in case DOM loading is delayed
setTimeout(initializeClickableCards, 2000);


const botCanvas = document.getElementById('botFlowCanvas');
const botCtx = botCanvas.getContext('2d');

// Fix blurry canvas for high-DPI displays
const dpr = window.devicePixelRatio || 1;
const rect = botCanvas.getBoundingClientRect();

// Set actual size in memory (scaled for high-DPI)
botCanvas.width = rect.width * dpr;
botCanvas.height = rect.height * dpr;

// Scale the canvas back down using CSS
botCanvas.style.width = rect.width + 'px';
botCanvas.style.height = rect.height + 'px';

// Scale the drawing context to match device pixel ratio
botCtx.scale(dpr, dpr);

// Enable image smoothing for better quality
botCtx.imageSmoothingEnabled = true;
botCtx.imageSmoothingQuality = 'high';

// Update canvas dimensions for calculations
const botWidth = rect.width;
const botHeight = rect.height;

// Active filters
let botActiveCategory = null;
let botActiveValue = null;
let botHoveredNode = null;
let botClickedNode = null;

let botAnimationProgress = 0;
let botIsAnimating = false;

// Flowing dots animation system
let flowingDots = [];
let lastDotTime = 0;
let animationId = null;
const maxDotsPerFlow = 3;
const dotCreationInterval = 800; // milliseconds

// Category options
const categoryOptions = {
  origin: ['Data Center', 'Residential Proxy', 'Mobile ISP'],
  sophistication: ['Simple', 'Moderate', 'Advanced'],
  industry: ['Retail', 'Travel', 'Financial', 'Business', 'Computing'],
  country: ['United States', 'Netherlands', 'Australia']
};

// Data
const botData = {
  stages: [
    {
      name: 'Origin',
      nodes: [
        { name: 'Data Center', value: 56, color: '#ef4444' },
        { name: 'Residential Proxy', value: 26, color: '#dc2626' },
        { name: 'Mobile ISP', value: 21, color: '#b91c1c' }
      ]
    },
    {
      name: 'Sophistication',
      nodes: [
        { name: 'Simple', value: 40, color: '#fbbf24' },
        { name: 'Moderate', value: 15, color: '#f59e0b' },
        { name: 'Advanced', value: 48, color: '#d97706' }
      ]
    },
    {
      name: 'Industry',
      nodes: [
        { name: 'Retail', value: 24, color: '#60a5fa' },
        { name: 'Travel', value: 25, color: '#3b82f6' },
        { name: 'Financial', value: 26, color: '#2563eb' },
        { name: 'Business', value: 13, color: '#1d4ed8' },
        { name: 'Computing', value: 8, color: '#1e40af' }
      ]
    },
    {
      name: 'Country',
      nodes: [
        { name: 'United States', value: 77, color: '#a855f7' },
        { name: 'Netherlands', value: 10, color: '#9333ea' },
        { name: 'Australia', value: 14, color: '#7e22ce' }
      ]
    }
  ],
  flows: [
    { from: [0, 0], to: [1, 0], value: 20, color: '#ef4444' },
    { from: [0, 0], to: [1, 1], value: 8, color: '#ef4444' },
    { from: [0, 0], to: [1, 2], value: 28, color: '#ef4444' },
    { from: [0, 1], to: [1, 0], value: 12, color: '#dc2626' },
    { from: [0, 1], to: [1, 1], value: 4, color: '#dc2626' },
    { from: [0, 1], to: [1, 2], value: 10, color: '#dc2626' },
    { from: [0, 2], to: [1, 0], value: 8, color: '#b91c1c' },
    { from: [0, 2], to: [1, 1], value: 3, color: '#b91c1c' },
    { from: [0, 2], to: [1, 2], value: 10, color: '#b91c1c' },
    
    { from: [1, 0], to: [2, 0], value: 15, color: '#fbbf24' },
    { from: [1, 0], to: [2, 1], value: 10, color: '#fbbf24' },
    { from: [1, 0], to: [2, 4], value: 8, color: '#fbbf24' },
    { from: [1, 2], to: [2, 2], value: 26, color: '#d97706' },
    { from: [1, 2], to: [2, 1], value: 12, color: '#d97706' },
    { from: [1, 2], to: [2, 3], value: 10, color: '#d97706' },
    { from: [1, 1], to: [2, 0], value: 6, color: '#f59e0b' },
    { from: [1, 1], to: [2, 1], value: 3, color: '#f59e0b' },
    { from: [1, 1], to: [2, 3], value: 3, color: '#f59e0b' },
    
    { from: [2, 0], to: [3, 0], value: 18, color: '#60a5fa' },
    { from: [2, 0], to: [3, 1], value: 3, color: '#60a5fa' },
    { from: [2, 0], to: [3, 2], value: 3, color: '#60a5fa' },
    { from: [2, 1], to: [3, 0], value: 12, color: '#3b82f6' },
    { from: [2, 1], to: [3, 2], value: 8, color: '#3b82f6' },
    { from: [2, 2], to: [3, 0], value: 25, color: '#2563eb' },
    { from: [2, 3], to: [3, 0], value: 8, color: '#1d4ed8' },
    { from: [2, 3], to: [3, 1], value: 2, color: '#1d4ed8' },
    { from: [2, 4], to: [3, 0], value: 7, color: '#1e40af' },
    { from: [2, 4], to: [3, 1], value: 1, color: '#1e40af' }
  ]
};

// Layout calculations
const botStageWidth = botWidth / 4;
const botNodeWidth = 100;
const botPadding = 35;
const botBottomPadding = 70;

// Calculate positions
const botPositions = botData.stages.map((stage, stageIdx) => {
  const x = stageIdx * botStageWidth + botStageWidth / 2;
  const totalHeight = stage.nodes.reduce((sum, n) => sum + n.value, 0) * 3.5;
  const availableHeight = botHeight - botPadding - botBottomPadding;
  const scale = Math.min(1, availableHeight / totalHeight);
  const scaledHeight = totalHeight * scale;
  const startY = botPadding + (availableHeight - scaledHeight) / 2;
  
  let currentY = startY;
  return stage.nodes.map(node => {
    const nodeHeight = node.value * 3.5 * scale;
    const pos = { x, y: currentY + nodeHeight / 2, height: nodeHeight };
    currentY += nodeHeight + 18;
    return pos;
  });
});

// Mouse interaction functions
function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getNodeAtPosition(x, y) {
  for (let stageIdx = 0; stageIdx < botData.stages.length; stageIdx++) {
    for (let nodeIdx = 0; nodeIdx < botData.stages[stageIdx].nodes.length; nodeIdx++) {
      const pos = botPositions[stageIdx][nodeIdx];
      if (x >= pos.x - botNodeWidth / 2 && x <= pos.x + botNodeWidth / 2 &&
          y >= pos.y - pos.height / 2 && y <= pos.y + pos.height / 2) {
        return { stageIdx, nodeIdx };
      }
    }
  }
  return null;
}

// Add mouse event listeners
botCanvas.addEventListener('mousemove', (evt) => {
  const mousePos = getMousePos(botCanvas, evt);
  const nodeAt = getNodeAtPosition(mousePos.x, mousePos.y);
  
  if (nodeAt && (!botHoveredNode || 
      botHoveredNode.stageIdx !== nodeAt.stageIdx || 
      botHoveredNode.nodeIdx !== nodeAt.nodeIdx)) {
    botHoveredNode = nodeAt;
    botCanvas.style.cursor = 'pointer';
    drawBotVisualization();
  } else if (!nodeAt && botHoveredNode) {
    botHoveredNode = null;
    botCanvas.style.cursor = 'default';
    drawBotVisualization();
  }
});

botCanvas.addEventListener('click', (evt) => {
  const mousePos = getMousePos(botCanvas, evt);
  const nodeAt = getNodeAtPosition(mousePos.x, mousePos.y);
  
  if (nodeAt) {
    botClickedNode = nodeAt;
    
    // Set the filter dropdowns to match the clicked node
    const stage = botData.stages[nodeAt.stageIdx];
    const node = stage.nodes[nodeAt.nodeIdx];
    const categoryMap = {
      0: 'origin',
      1: 'sophistication', 
      2: 'industry',
      3: 'country'
    };
    
    botActiveCategory = categoryMap[nodeAt.stageIdx];
    botActiveValue = node.name;
    
    // Update UI dropdowns
    const categorySelect = document.getElementById('botCategorySelect');
    const valueSelect = document.getElementById('botValueSelect');
    const valueSelectGroup = document.getElementById('botValueSelectGroup');
    const valueLabel = document.getElementById('botValueLabel');
    
    categorySelect.value = botActiveCategory;
    valueSelectGroup.style.display = 'flex';
    valueLabel.textContent = `Step 2: Choose ${botActiveCategory.charAt(0).toUpperCase() + botActiveCategory.slice(1)}`;
    
    // Populate and select value
    valueSelect.innerHTML = '<option value="">Select...</option>';
    categoryOptions[botActiveCategory].forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      valueSelect.appendChild(opt);
    });
    valueSelect.value = botActiveValue;
    
    animateTransition();
  } else {
    botClickedNode = null;
  }
});

// Flowing dots animation functions
function createFlowingDot(flowIdx) {
  const flow = botData.flows[flowIdx];
  return {
    flowIdx,
    progress: 0,
    speed: 0.008 + Math.random() * 0.004, // Random speed for variety
    life: 1.0,
    color: flow.color,
    size: 3 + Math.random() * 2,
    opacity: 0.8 + Math.random() * 0.2,
    glowSize: 8 + Math.random() * 4,
    id: Math.random()
  };
}

function updateFlowingDots(currentTime) {
  const filtered = getFilteredElements();
  
  // Create new dots periodically
  if (currentTime - lastDotTime > dotCreationInterval) {
    if (!filtered) {
      // No filters - create dots on random flows
      if (Math.random() < 0.4) {
        const randomFlowIdx = Math.floor(Math.random() * botData.flows.length);
        // Limit dots per flow
        const dotsOnThisFlow = flowingDots.filter(dot => dot.flowIdx === randomFlowIdx).length;
        if (dotsOnThisFlow < maxDotsPerFlow) {
          flowingDots.push(createFlowingDot(randomFlowIdx));
        }
      }
    } else {
      // Only create dots on filtered flows
      if (filtered.flows.size > 0 && Math.random() < 0.7) {
        const filteredFlowsArray = Array.from(filtered.flows);
        const randomFlowIdx = filteredFlowsArray[Math.floor(Math.random() * filteredFlowsArray.length)];
        const dotsOnThisFlow = flowingDots.filter(dot => dot.flowIdx === randomFlowIdx).length;
        if (dotsOnThisFlow < maxDotsPerFlow) {
          flowingDots.push(createFlowingDot(randomFlowIdx));
        }
      }
    }
    lastDotTime = currentTime;
  }
  
  // Update existing dots
  flowingDots = flowingDots.filter(dot => {
    dot.progress += dot.speed;
    dot.life -= 0.008;
    return dot.progress < 1.0 && dot.life > 0;
  });
}

function drawFlowingDots() {
  const filtered = getFilteredElements();
  
  flowingDots.forEach(dot => {
    const flow = botData.flows[dot.flowIdx];
    const fromPos = botPositions[flow.from[0]][flow.from[1]];
    const toPos = botPositions[flow.to[0]][flow.to[1]];
    
    // Skip if this flow should be hidden
    if (filtered && !filtered.flows.has(dot.flowIdx)) {
      return;
    }
    
    // Calculate position along bezier curve
    const startX = fromPos.x + botNodeWidth / 2;
    const startY = fromPos.y;
    const endX = toPos.x - botNodeWidth / 2;
    const endY = toPos.y;
    
    const cp1X = fromPos.x + botStageWidth / 2;
    const cp1Y = fromPos.y;
    const cp2X = toPos.x - botStageWidth / 2;
    const cp2Y = toPos.y;
    
    // Bezier curve calculation
    const t = dot.progress;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    
    const x = mt3 * startX + 3 * mt2 * t * cp1X + 3 * mt * t2 * cp2X + t3 * endX;
    const y = mt3 * startY + 3 * mt2 * t * cp1Y + 3 * mt * t2 * cp2Y + t3 * endY;
    
    // Draw dot with multiple glow layers for enhanced effect
    botCtx.save();
    
    // Outer glow (largest)
    botCtx.globalAlpha = dot.opacity * dot.life * 0.15;
    botCtx.fillStyle = dot.color;
    botCtx.beginPath();
    botCtx.arc(x, y, dot.glowSize, 0, 2 * Math.PI);
    botCtx.fill();
    
    // Middle glow
    botCtx.globalAlpha = dot.opacity * dot.life * 0.3;
    botCtx.beginPath();
    botCtx.arc(x, y, dot.glowSize * 0.6, 0, 2 * Math.PI);
    botCtx.fill();
    
    // Inner glow
    botCtx.globalAlpha = dot.opacity * dot.life * 0.6;
    botCtx.beginPath();
    botCtx.arc(x, y, dot.size * 1.5, 0, 2 * Math.PI);
    botCtx.fill();
    
    // Core dot
    botCtx.globalAlpha = dot.opacity * dot.life;
    botCtx.fillStyle = '#ffffff';
    botCtx.beginPath();
    botCtx.arc(x, y, dot.size, 0, 2 * Math.PI);
    botCtx.fill();
    
    botCtx.restore();
  });
}

// Find only DIRECT connections (not all reachable nodes)
function findConnectedElements(stageIdx, nodeIdx) {
  const connectedNodes = new Set();
  const connectedFlows = new Set();
  
  // Add the selected node
  connectedNodes.add(`${stageIdx}-${nodeIdx}`);
  
  // Find DIRECT flows FROM this node (one step forward)
  botData.flows.forEach((flow, flowIdx) => {
    if (flow.from[0] === stageIdx && flow.from[1] === nodeIdx) {
      connectedFlows.add(flowIdx);
      connectedNodes.add(`${flow.to[0]}-${flow.to[1]}`);
    }
  });
  
  // Find DIRECT flows TO this node (one step backward)
  botData.flows.forEach((flow, flowIdx) => {
    if (flow.to[0] === stageIdx && flow.to[1] === nodeIdx) {
      connectedFlows.add(flowIdx);
      connectedNodes.add(`${flow.from[0]}-${flow.from[1]}`);
    }
  });
  
  // Now recursively add all forward paths
  const nodesToProcess = Array.from(connectedNodes).filter(n => {
    const [s, i] = n.split('-').map(Number);
    return s > stageIdx; // Only process nodes ahead
  });
  
  nodesToProcess.forEach(nodeKey => {
    const [s, i] = nodeKey.split('-').map(Number);
    
    botData.flows.forEach((flow, flowIdx) => {
      if (flow.from[0] === s && flow.from[1] === i) {
        connectedFlows.add(flowIdx);
        const targetKey = `${flow.to[0]}-${flow.to[1]}`;
        if (!connectedNodes.has(targetKey)) {
          connectedNodes.add(targetKey);
          nodesToProcess.push(targetKey);
        }
      }
    });
  });
  
  // Recursively add all backward paths
  const backwardNodes = Array.from(connectedNodes).filter(n => {
    const [s, i] = n.split('-').map(Number);
    return s < stageIdx; // Only process nodes behind
  });
  
  backwardNodes.forEach(nodeKey => {
    const [s, i] = nodeKey.split('-').map(Number);
    
    botData.flows.forEach((flow, flowIdx) => {
      if (flow.to[0] === s && flow.to[1] === i) {
        connectedFlows.add(flowIdx);
        const sourceKey = `${flow.from[0]}-${flow.from[1]}`;
        if (!connectedNodes.has(sourceKey)) {
          connectedNodes.add(sourceKey);
          backwardNodes.push(sourceKey);
        }
      }
    });
  });
  
  return { nodes: connectedNodes, flows: connectedFlows };
}

// Get filtered elements based on current selection
function getFilteredElements() {
  if (!botActiveCategory || !botActiveValue) {
    return null; // No filters active
  }
  
  let filteredNodes = new Set();
  let filteredFlows = new Set();
  
  // Map category to stage index
  const stageMap = {
    origin: 0,
    sophistication: 1,
    industry: 2,
    country: 3
  };
  
  const stageIdx = stageMap[botActiveCategory];
  
  // Find the matching node
  botData.stages[stageIdx].nodes.forEach((node, nodeIdx) => {
    if (node.name === botActiveValue) {
      const connected = findConnectedElements(stageIdx, nodeIdx);
      connected.nodes.forEach(n => filteredNodes.add(n));
      connected.flows.forEach(f => filteredFlows.add(f));
    }
  });
  
  console.log('Filter:', botActiveCategory, '=', botActiveValue);
  console.log('Connected nodes:', filteredNodes.size);
  console.log('Connected flows:', filteredFlows.size);
  
  return { nodes: filteredNodes, flows: filteredFlows };
}

// Animate transition
function animateTransition(callback) {
  if (botIsAnimating) return;
  
  botIsAnimating = true;
  const startTime = performance.now();
  const duration = 1000;
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-in-out
    botAnimationProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    drawBotVisualization();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      botIsAnimating = false;
      botAnimationProgress = 1;
      if (callback) callback();
    }
  }
  
  requestAnimationFrame(animate);
}

function drawBotVisualization() {
  botCtx.clearRect(0, 0, botWidth, botHeight);
  
  // Enable high-quality rendering
  botCtx.textBaseline = 'alphabetic';
  botCtx.textRenderingOptimization = 'optimizeQuality';
  
  const filtered = getFilteredElements();
  const hasFilters = filtered !== null;
  
  // Update flowing dots animation
  updateFlowingDots(Date.now());
  
  // Draw flows
  botData.flows.forEach((flow, flowIdx) => {
    const fromPos = botPositions[flow.from[0]][flow.from[1]];
    const toPos = botPositions[flow.to[0]][flow.to[1]];
    const thickness = Math.max(2, flow.value / 1.5);
    
    let opacity = 0.25;
    let shouldShow = true;
    
    if (hasFilters) {
      if (filtered.flows.has(flowIdx)) {
        opacity = 0.7;
      } else {
        opacity = 0.05;
        shouldShow = botAnimationProgress < 0.5; // Fade out in first half
      }
    }
    
    if (shouldShow) {
      botCtx.save();
      
      // Add subtle pulsing effect to highlighted flows
      let pulseMultiplier = 1;
      if (hasFilters && filtered.flows.has(flowIdx)) {
        pulseMultiplier = 1 + 0.3 * Math.sin(Date.now() * 0.003);
      }
      
      botCtx.strokeStyle = flow.color;
      botCtx.lineWidth = thickness * pulseMultiplier;
      botCtx.lineCap = 'round';
      botCtx.lineJoin = 'round';
      botCtx.globalAlpha = opacity * (shouldShow ? 1 : (1 - (botAnimationProgress - 0.5) * 2));
      
      // Add glow for highlighted flows
      if (hasFilters && filtered.flows.has(flowIdx)) {
        botCtx.shadowColor = flow.color;
        botCtx.shadowBlur = 10 * pulseMultiplier;
        botCtx.shadowOffsetX = 0;
        botCtx.shadowOffsetY = 0;
      }
      
      botCtx.beginPath();
      botCtx.moveTo(fromPos.x + botNodeWidth / 2, fromPos.y);
      
      const cpX1 = fromPos.x + botStageWidth / 2;
      const cpX2 = toPos.x - botStageWidth / 2;
      
      botCtx.bezierCurveTo(
        cpX1, fromPos.y,
        cpX2, toPos.y,
        toPos.x - botNodeWidth / 2, toPos.y
      );
      botCtx.stroke();
      botCtx.restore();
    }
  });
  
  // Draw flowing dots
  drawFlowingDots();
  
  botCtx.globalAlpha = 1;
  
  // Draw nodes
  botData.stages.forEach((stage, stageIdx) => {
    // Draw stage title with improved quality
    botCtx.save();
    botCtx.fillStyle = '#9ca3af';
    botCtx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    botCtx.textAlign = 'center';
    botCtx.textBaseline = 'top';
    
    // Add subtle text shadow for better readability
    botCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    botCtx.shadowBlur = 1;
    botCtx.shadowOffsetX = 0;
    botCtx.shadowOffsetY = 1;
    
    botCtx.fillText(stage.name.toUpperCase(), stageIdx * botStageWidth + botStageWidth / 2, 15);
    botCtx.restore();
    
    stage.nodes.forEach((node, nodeIdx) => {
      const pos = botPositions[stageIdx][nodeIdx];
      const nodeKey = `${stageIdx}-${nodeIdx}`;
      
      const isHovered = botHoveredNode && botHoveredNode.stageIdx === stageIdx && botHoveredNode.nodeIdx === nodeIdx;
      const isClicked = botClickedNode && botClickedNode.stageIdx === stageIdx && botClickedNode.nodeIdx === nodeIdx;
      
      let opacity = 1;
      let scale = 1;
      let shouldShow = true;
      
      if (hasFilters) {
        if (filtered.nodes.has(nodeKey)) {
          opacity = 1;
          scale = 1 + (botAnimationProgress * 0.15); // Grow slightly
        } else {
          opacity = 0.1;
          scale = 1 - (botAnimationProgress * 0.3); // Shrink
          shouldShow = botAnimationProgress < 0.7; // Disappear in first 70%
        }
      }
      
      // Apply hover and click scaling
      if (isHovered) scale *= 1.1;
      if (isClicked) scale *= 1.15;
      
      if (shouldShow && scale > 0) {
        const adjustedOpacity = opacity * (shouldShow ? 1 : (1 - (botAnimationProgress - 0.7) / 0.3));
        
        botCtx.save();
        botCtx.translate(pos.x, pos.y);
        botCtx.scale(scale, scale);
        botCtx.translate(-pos.x, -pos.y);
        
        // Add enhanced glow effects
        let glowIntensity = 0;
        if (isClicked) {
          glowIntensity = 25 + 10 * Math.sin(Date.now() * 0.005);
        } else if (isHovered) {
          glowIntensity = 20 + 5 * Math.sin(Date.now() * 0.004);
        } else if (filtered && filtered.nodes.has(nodeKey)) {
          glowIntensity = 15 + 5 * Math.sin(Date.now() * 0.003);
        }
        
        if (glowIntensity > 0) {
          botCtx.shadowColor = node.color;
          botCtx.shadowBlur = glowIntensity;
          botCtx.shadowOffsetX = 0;
          botCtx.shadowOffsetY = 0;
        }
        
        // Draw node rectangle with rounded corners for better appearance
        botCtx.globalAlpha = adjustedOpacity;
        botCtx.fillStyle = node.color;
        
        // Use rounded rectangle for smoother appearance
        const cornerRadius = 4;
        const x = pos.x - botNodeWidth / 2;
        const y = pos.y - pos.height / 2;
        const width = botNodeWidth;
        const height = pos.height;
        
        botCtx.beginPath();
        botCtx.moveTo(x + cornerRadius, y);
        botCtx.lineTo(x + width - cornerRadius, y);
        botCtx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
        botCtx.lineTo(x + width, y + height - cornerRadius);
        botCtx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
        botCtx.lineTo(x + cornerRadius, y + height);
        botCtx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
        botCtx.lineTo(x, y + cornerRadius);
        botCtx.quadraticCurveTo(x, y, x + cornerRadius, y);
        botCtx.closePath();
        botCtx.fill();
        
        // Draw border with rounded corners
        let borderColor = '#000';
        let borderWidth = 2;
        
        if (isClicked) {
          borderColor = '#ffffff';
          borderWidth = 3;
        } else if (isHovered) {
          borderColor = '#ffffff';
          borderWidth = 2;
        } else if (filtered && filtered.nodes.has(nodeKey)) {
          borderColor = '#ffffff';
          borderWidth = 3;
        }
        
        botCtx.strokeStyle = borderColor;
        botCtx.lineWidth = borderWidth;
        botCtx.stroke(); // Use the same rounded path for border
        
        // Draw node name with improved quality
        botCtx.fillStyle = '#ffffff';
        botCtx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        botCtx.textAlign = 'center';
        botCtx.textBaseline = 'middle';
        
        // Enhanced text shadow for better contrast
        botCtx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        botCtx.shadowBlur = 3;
        botCtx.shadowOffsetX = 1;
        botCtx.shadowOffsetY = 1;
        
        const words = node.name.split(' ');
        const lineHeight = 16;
        const startY = pos.y - ((words.length - 1) * lineHeight / 2);
        
        words.forEach((word, i) => {
          botCtx.fillText(word, pos.x, startY + i * lineHeight);
        });
        
        botCtx.shadowBlur = 0;
        
        botCtx.restore();
      }
    });
  });
  
  botCtx.globalAlpha = 1;
  
  // Continue animation loop
  animationId = requestAnimationFrame(drawBotVisualization);
}

// Start continuous animation
function startBotAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  drawBotVisualization();
}

// Stop animation (for cleanup)
function stopBotAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Event listeners for filters
const categorySelect = document.getElementById('botCategorySelect');
const valueSelectGroup = document.getElementById('botValueSelectGroup');
const valueSelect = document.getElementById('botValueSelect');
const valueLabel = document.getElementById('botValueLabel');

categorySelect.addEventListener('change', (e) => {
  const category = e.target.value;
  
  if (category) {
    // Show second dropdown
    valueSelectGroup.style.display = 'flex';
    valueLabel.textContent = `Step 2: Choose ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    
    // Populate options
    valueSelect.innerHTML = '<option value="">Select...</option>';
    categoryOptions[category].forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      valueSelect.appendChild(opt);
    });
    
    // Reset value selection
    botActiveCategory = category;
    botActiveValue = null;
    valueSelect.value = '';
  } else {
    // Hide second dropdown
    valueSelectGroup.style.display = 'none';
    botActiveCategory = null;
    botActiveValue = null;
    animateTransition();
  }
});

valueSelect.addEventListener('change', (e) => {
  botActiveValue = e.target.value || null;
  animateTransition();
});

document.getElementById('botResetFilters').addEventListener('click', () => {
  botActiveCategory = null;
  botActiveValue = null;
  categorySelect.value = '';
  valueSelect.value = '';
  valueSelectGroup.style.display = 'none';
  animateTransition();
});

// Initial setup and start continuous animation
botAnimationProgress = 1;
startBotAnimation();
console.log('✅ Bot visualization with flowing dots animation started!');

// Handle page visibility to optimize performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopBotAnimation();
  } else {
    startBotAnimation();
  }
});

// ========================================
// SOCIAL MEDIA PLATFORM DASHBOARD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const platformIcons = document.querySelectorAll('.platform-icon');
  const modal = document.getElementById('platformDashboard');
  const closeBtn = document.getElementById('closeDashboard');
  const platformSelector = document.getElementById('platformSelector');
  const dashboardContent = document.getElementById('dashboardContent');
  const tabTitle = document.getElementById('tabTitle');
  const platformGrid = document.querySelector('.platform-grid');
  const body = document.body;

  // Platform data
  const platformData = {
    twitter: {
      name: 'Twitter/X',
      category: 'Microblogging & Social Networking',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      colorClass: 'twitter-icon',
      stats: {
        estimatedBotRate: '5-15%',
        activeUsers: '550M',
        auditResult: 'Failed 2024 Tests',
        enforcement: 'Reactive Only'
      },
      impact: 'Twitter/X faces challenges with automated accounts, particularly spam bots, engagement bots, and misinformation spreaders. The platform has implemented various detection systems and verification processes to combat bot activity.',
      platformClaims: [
        'Automated bot-detection using machine-learning',
        'Removing fake/spam accounts in "purges"',
        'Labeling "automated" accounts (rarely used now)',
        'Rate-limits & verification changes intended to reduce bot activity'
      ],
      researchFindings: [
        'Bots are still highly active, including political bots',
        'A 2024 audit found X failed all bot-policy enforcement tests: test bots posted freely',
        'Advanced bots that mimic human timing and linguistic patterns are especially hard to detect at scale',
        'Enforcement is largely reactive rather than proactive'
      ],
      researchSource: 'Social Media Bot Policies: Passive and Active Enforcement (2024) - https://arxiv.org/pdf/2409.18931',
      strategies: [
        'Blue checkmark verification system for authentic accounts',
        'Advanced machine learning algorithms to detect suspicious behavior patterns',
        'Rate limiting and CAPTCHA challenges for suspicious activities',
        'Community-driven reporting and moderation systems',
        'API restrictions to prevent automated mass posting'
      ]
    },
    facebook: {
      name: 'Facebook',
      category: 'Social Networking',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
      colorClass: 'facebook-icon',
      stats: {
        estimatedBotRate: '5-10%',
        activeUsers: '3.07B',
        quarterlyRemovals: '1.3-2.2B',
        dataSource: 'Meta Reports'
      },
      impact: 'Facebook removes billions of fake accounts quarterly. Despite aggressive measures, the platform continues to battle sophisticated bot networks that create fake accounts for spam, scams, and misinformation campaigns.',
      platformClaims: [
        'Large-scale bot takedowns (billions of fake accounts removed yearly)',
        'Machine-learning detection of fake engagement',
        'Authenticity policies banning coordinated inauthentic behavior (CIB)',
        'Hundreds of millions of fake accounts removed per quarter'
      ],
      researchFindings: [
        'Facebook has removed 2–3 billion fake accounts per quarter, but these numbers suggest automation is constantly making new ones',
        'Bot networks repeatedly influence political discourse and misinformation campaigns',
        'Detection is harder on Facebook due to private groups & mixed content',
        'Independent studies estimate a 5–10% fake account rate among active users'
      ],
      researchSource: 'Meta Transparency Reports - https://transparency.fb.com/data/community-standards-enforcement/fake-accounts/',
      strategies: [
        'AI-powered detection systems that identify fake accounts before they become active',
        'Quarterly transparency reports on fake account removals',
        'Two-factor authentication for enhanced security',
        'Continuous monitoring of suspicious behavior patterns',
        'Partnership with cybersecurity organizations'
      ],
      hasChart: true
    },
    instagram: {
      name: 'Instagram',
      category: 'Photo & Video Sharing',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
      colorClass: 'instagram-icon',
      stats: {
        fakFollowerRate: 'Up to 45%',
        activeUsers: '2B+',
        influencerFraud: '50%+',
        fraudType: 'Follower/Engagement'
      },
      impact: 'Instagram battles engagement pods, follower bots, and spam accounts. Fake likes, comments, and followers are common, affecting content visibility and platform authenticity.',
      platformClaims: [
        'Fake follower & fake like detection',
        'Removing "inauthentic likes" from automation services',
        'Blocking mass-follow / mass-unfollow bot behaviors',
        'Crackdowns on "bot farms" that generate engagement'
      ],
      researchFindings: [
        'Instagram has one of the highest fake follower rates of any platform',
        'Up to 45% of influencer followers may be bots or inactive accounts',
        'Bots are heavily used for influencer marketing fraud',
        'Machine-learning detection struggles because content is image-heavy',
        'More than half of influencers show some form of follower or engagement fraud'
      ],
      researchSource: 'Various marketing-analytics firms & Anura bot analysis - https://www.anura.io/blog/how-to-tell-if-facebook-instagram-or-tik-tok-bots-are-following-you',
      strategies: [
        'Machine learning to detect inauthentic engagement patterns',
        'Removal of fake likes, follows, and comments',
        'Account verification badges for authentic profiles',
        'Shadowbanning suspicious automation tools',
        'Regular purges of inactive and fake accounts'
      ]
    },
    tiktok: {
      name: 'TikTok',
      category: 'Short-Form Video',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
      colorClass: 'tiktok-icon',
      hasChart: true,
      stats: {
        fakeEngagement: '20-30%',
        activeUsers: '1.5B+',
        detectionDifficulty: 'Highest',
        contentType: 'Video-Based'
      },
      impact: 'TikTok faces significant bot challenges with view bots, follower bots, and automated comment spam. The platform\'s algorithm-driven content discovery makes it particularly vulnerable to artificial engagement manipulation.',
      platformClaims: [
        'Automated detection for bots & spam accounts',
        'Limits on commenting/posting frequency',
        'Bans on automated engagement-boosting tools',
        'Transparency about "coordinated influence operations"'
      ],
      researchFindings: [
        'TikTok is considered VERY bot-heavy, especially in comment sections',
        'Marketing studies estimate up to 20–30% of engagement for some creators may be bots',
        'Advanced bots use AI-generated video captions, reuse audio, and post at human-like intervals',
        'Hardest platform for bot detection because content is short-form video (not text)',
        'Fake-follower audits frequently show inflated engagement'
      ],
      researchSource: 'Performance-marketing analyses and platform-agnostic audits',
      strategies: [
        'Advanced AI to detect view manipulation and fake engagement',
        'Content authenticity verification systems',
        'Creator verification programs',
        'Automated spam filtering and shadowbanning',
        'Regular security audits and bot detection updates'
      ]
    },
    reddit: {
      name: 'Reddit',
      category: 'Forum & Discussion Platform',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>`,
      colorClass: 'reddit-icon',
      stats: {
        botLikeBehavior: '5-15%',
        activeUsers: '430M+',
        auditResult: 'Failed 2024',
        allowsGoodBots: 'Yes'
      },
      impact: 'Reddit deals with karma-farming bots, repost bots, and comment spam. Some bots serve useful purposes (like moderator bots), but malicious bots spread misinformation and manipulate discussions.',
      platformClaims: [
        'Detection of automated accounts via behavior signals',
        'Banning bots that violate rules (spam, manipulation)',
        'Some legitimate bots (AutoModerator, utility bots) are allowed',
        'Anti-brigading & anti-manipulation rules'
      ],
      researchFindings: [
        'Reddit hosts both "good bots" (helpful) and "malicious bots" (brigading, spam)',
        'Studies show bots often influence political threads',
        'Estimates vary: 5–15% of Reddit accounts exhibit bot-like behavior',
        'A 2024 audit showed Reddit failed enforcement tests for new AI-generated bots',
        'Harder to detect because Reddit allows some automation, creating ambiguity'
      ],
      researchSource: '2024 enforcement audit - Social Media Bot Policies study',
      strategies: [
        'Karma and account age requirements for posting',
        'Community-specific automoderator rules',
        'CAPTCHA challenges for new accounts',
        'Shadowbanning and bot detection algorithms',
        'User-powered reporting and moderation'
      ]
    },
    youtube: {
      name: 'YouTube',
      category: 'Video Sharing & Streaming',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
      colorClass: 'youtube-icon',
      stats: {
        fakeViewRate: 'Up to 30%',
        activeUsers: '2.7B+',
        fakeSubscribers: '5-20%',
        targetContent: 'Monetized'
      },
      impact: 'YouTube battles view bots, subscriber bots, and spam comment bots. Fake engagement affects creator monetization and content recommendations, prompting ongoing detection improvements.',
      platformClaims: [
        'Machine-learning to detect fake views',
        'Removing fake subscribers & view-bots',
        'Blocking comment-spam bots',
        'Removing "coordinated influence networks" on political content'
      ],
      researchFindings: [
        'YouTube is heavily targeted by view-bots and comment bots',
        'Studies estimate up to 30% of views on some videos may be inauthentic',
        'Bot networks can artificially promote music videos, influencer channels, or political commentary',
        'Estimates of fake subscribers vary from 5–20% for mid-tier creators',
        'Detection is more difficult because YouTube primarily analyzes watch-time patterns'
      ],
      researchSource: 'YouTube Transparency Reports - https://transparencyreport.google.com/youtube-policy/removals & Industry analysis of view-fraud',
      strategies: [
        'Advanced spam filters for comments and engagement',
        'View validation systems to detect artificial inflation',
        'Creator verification and authentication',
        'Automated content moderation with AI',
        'Regular audits of subscriber counts and engagement metrics'
      ]
    }
  };

  // If the dashboard shell is missing, bail early to avoid errors
  if (!modal || !platformSelector || !dashboardContent || !tabTitle) {
    return;
  }

  function renderDashboard(platform) {
    const data = platformData[platform];
    if (!data) return;

    platformSelector.value = platform;
    tabTitle.textContent = `${data.name} Dashboard`;

    dashboardContent.innerHTML = `
      <div class="platform-header">
        <div class="platform-logo-large ${data.colorClass}">
          ${data.icon}
        </div>
        <div class="platform-info">
          <h2>${data.name}</h2>
          <span class="platform-category">${data.category}</span>
        </div>
      </div>

      <div class="data-methodology-notice">
        <div class="notice-icon">ℹ️</div>
        <div class="notice-content">
          <strong>About These Metrics:</strong> Each platform uses different measurement methodologies and reporting periods. 
          Data sources include official transparency reports (where available), independent audits, and academic research. 
          Metrics are not directly comparable across platforms due to varying definitions of "fake accounts," "bots," and detection methods.
        </div>
      </div>

      <div class="stats-grid">
        ${Object.entries(data.stats).map(([key, value]) => `
          <div class="stat-card info-stat" data-stat="${key}">
            <div class="stat-value">${value}</div>
            <div class="stat-label">${key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</div>
            <div class="stat-info">📊 Hover for context</div>
          </div>
        `).join('')}
      </div>

      ${data.hasChart && platform === 'facebook' ? '<div id="facebookBotChart" class="platform-chart"></div>' : ''}
      ${data.hasChart && platform === 'tiktok' ? '<div id="tiktokBotChart" class="platform-chart"></div>' : ''}

      <div class="bot-impact">
        <h3>🤖 Bot Impact & Challenges</h3>
        <p>${data.impact}</p>
      </div>

      <div class="claims-reality-container">
        <div class="claims-reality-header">
          <h2>Claims vs Reality Analysis</h2>
          <div class="view-toggle">
            <button class="toggle-view active" data-view="split">Split View</button>
            <button class="toggle-view" data-view="claims">Claims Only</button>
            <button class="toggle-view" data-view="reality">Reality Only</button>
          </div>
        </div>

        <div class="claims-vs-reality" id="claimsRealityContent">
          <div class="claims-section">
            <h3>🛡️ What ${data.name} Claims They Do</h3>
            <ul class="claims-list">
              ${data.platformClaims.map(claim => `<li>${claim}</li>`).join('')}
            </ul>
          </div>
          
          <div class="reality-section">
            <h3>🔎 What Independent Studies Show</h3>
            <ul class="findings-list">
              ${data.researchFindings.map(finding => `<li>${finding}</li>`).join('')}
            </ul>
            ${data.researchSource ? `<p class="research-source"><strong>Source:</strong> ${data.researchSource}</p>` : ''}
          </div>
        </div>
      </div>

      <div class="mitigation-strategies expanded">
        <div class="section-header expandable" onclick="this.parentElement.classList.toggle('expanded')">
          <h3>🛡️ Current Mitigation Strategies</h3>
          <span class="expand-icon">▼</span>
        </div>
        <div class="expandable-content">
          <ul class="strategy-list">
            ${data.strategies.map((strategy, idx) => `
              <li style="animation-delay: ${idx * 0.1}s">${strategy}</li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="data-sources-section">
        <h3>📚 Data Sources & Methodology</h3>
        <div class="source-card">
          <div class="source-label">Primary Sources:</div>
          <div class="source-text">${data.researchSource || 'Multiple independent research studies and platform reports'}</div>
        </div>
        <div class="methodology-info">
          <p><strong>Note:</strong> All statistics are derived from publicly available data, 
          including official platform transparency reports, academic research papers, 
          independent security audits, and verified journalism sources. Data accuracy 
          depends on platform disclosure policies and third-party verification methods.</p>
        </div>
      </div>
    `;

    // Load Facebook chart if applicable
    if (platform === 'facebook' && data.hasChart) {
      loadFacebookBotChart();
    }
    
    // Load TikTok chart if applicable
    if (platform === 'tiktok' && data.hasChart) {
      loadTikTokBotChart();
    }

    // Add interactive features to stat cards
    addStatCardInteractivity();
    
    // Add toggle view functionality
    addClaimsRealityToggle();
  }

  function addClaimsRealityToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-view');
    const claimsSection = document.querySelector('.claims-section');
    const realitySection = document.querySelector('.reality-section');
    const container = document.querySelector('.claims-vs-reality');
    
    if (!toggleButtons.length || !claimsSection || !realitySection) return;
    
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active from all buttons
        toggleButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const view = this.dataset.view;
        
        // Apply fade out animation
        claimsSection.style.opacity = '0';
        realitySection.style.opacity = '0';
        container.style.opacity = '0';
        
        setTimeout(() => {
          switch(view) {
            case 'split':
              container.style.display = 'grid';
              claimsSection.style.display = 'block';
              realitySection.style.display = 'block';
              break;
            case 'claims':
              container.style.display = 'block';
              claimsSection.style.display = 'block';
              realitySection.style.display = 'none';
              break;
            case 'reality':
              container.style.display = 'block';
              claimsSection.style.display = 'none';
              realitySection.style.display = 'block';
              break;
          }
          
          // Fade in animation
          setTimeout(() => {
            container.style.opacity = '1';
            claimsSection.style.opacity = '1';
            realitySection.style.opacity = '1';
          }, 50);
        }, 300);
      });
    });
  }

  function addStatCardInteractivity() {
    const statCards = document.querySelectorAll('.info-stat');
    const platform = platformSelector.value;
    const data = platformData[platform];
    
    // Define context for each metric type
    const metricContext = {
      estimatedBotRate: `Based on independent security audits and research studies analyzing account behavior patterns.`,
      auditResult: `Results from third-party transparency audits examining platform compliance with content moderation standards.`,
      enforcement: `Type of bot detection and removal strategy employed by the platform.`,
      quarterlyRemovals: `Official transparency report data showing fake accounts removed per quarter.`,
      dataSource: `Primary source of the statistical information presented.`,
      fakFollowerRate: `Percentage of accounts with fake or bot followers, based on influencer account analysis.`,
      influencerFraud: `Rate of fraudulent engagement (fake likes, comments) in influencer marketing campaigns.`,
      fakeEngagement: `Estimated percentage of platform engagement coming from inauthentic accounts.`,
      detectionDifficulty: `Relative difficulty of identifying bots due to AI sophistication and platform architecture.`,
      botLikeBehavior: `Accounts exhibiting automated behavior patterns, though not all are malicious.`,
      allowsGoodBots: `Whether the platform permits beneficial bots (moderation, service, archive bots).`,
      fakeViewRate: `Percentage of video views estimated to come from bot or fake accounts.`,
      fakeSubscribers: `Rate of fake or inactive subscriber accounts across the platform.`,
      targetContent: `Types of content most frequently targeted by bot manipulation.`
    };
    
    statCards.forEach(card => {
      const statName = card.dataset.stat;
      const contextText = metricContext[statName] || 'Statistical data from platform reports and independent research.';
      
      // Enhanced hover effect with tooltip
      card.addEventListener('mouseenter', function() {
        const indicator = this.querySelector('.stat-info');
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'stat-tooltip';
        tooltip.innerHTML = `
          <div class="tooltip-header">${statName.replace(/([A-Z])/g, ' $1').trim()}</div>
          <div class="tooltip-body">${contextText}</div>
        `;
        this.appendChild(tooltip);
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
      });

      card.addEventListener('mouseleave', function() {
        const indicator = this.querySelector('.stat-info');
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(5px)';
        
        const tooltip = this.querySelector('.stat-tooltip');
        if (tooltip) {
          tooltip.classList.remove('visible');
          setTimeout(() => tooltip.remove(), 200);
        }
      });
    });
  }

  async function loadTikTokBotChart() {
    try {
      const response = await fetch('Datasets/search_country/tiktok.csv');
      const csvText = await response.text();
      const lines = csvText.split('\n').slice(1); // Skip header
      
      const accountsRemovedData = [];
      
      lines.forEach(line => {
        if (!line.trim()) return;
        const parts = line.split(',');
        
        // Look for "Accounts removed" with "Other accounts removed" (fake/inauthentic accounts)
        if (parts[0] === 'Accounts removed' && parts[4] === 'Other accounts removed') {
          const period = parts[2]; // e.g., "Jul-Sep 2020"
          const value = parseFloat(parts[9]);
          
          if (period && !isNaN(value)) {
            accountsRemovedData.push({ period, value });
          }
        }
      });
      
      // Sort by period
      accountsRemovedData.sort((a, b) => {
        const [monthsA, yearA] = a.period.split(' ');
        const [monthsB, yearB] = b.period.split(' ');
        
        const yearDiff = parseInt(yearA) - parseInt(yearB);
        if (yearDiff !== 0) return yearDiff;
        
        const monthOrder = { 'Jan': 1, 'Apr': 4, 'Jul': 7, 'Oct': 10 };
        const monthA = monthOrder[monthsA.split('-')[0]];
        const monthB = monthOrder[monthsB.split('-')[0]];
        return monthA - monthB;
      });
      
      renderTikTokChart(accountsRemovedData);
    } catch (error) {
      console.error('Error loading TikTok data:', error);
      document.getElementById('tiktokBotChart').innerHTML = 
        '<p style="text-align: center; color: #888;">Unable to load chart data</p>';
    }
  }

  async function loadFacebookBotChart() {
    try {
      const response = await fetch('Datasets/facebook_report.csv');
      const csvText = await response.text();
      
      // Parse CSV
      const lines = csvText.split('\n');
      const fakeAccountsData = [];
      
      lines.forEach(line => {
        if (line.includes('Fake Accounts,Content Actioned')) {
          const parts = line.split(',');
          const period = parts[3];
          const value = parts[4].replace(/"/g, '').replace(/,/g, '');
          
          if (period && value && value !== 'N/A') {
            fakeAccountsData.push({
              period: period,
              value: parseInt(value)
            });
          }
        }
      });

      // Sort by period
      fakeAccountsData.sort((a, b) => {
        const getYearQuarter = (period) => {
          const year = parseInt(period.substring(0, 4));
          const quarter = parseInt(period.substring(5, 6));
          return year * 10 + quarter;
        };
        return getYearQuarter(a.period) - getYearQuarter(b.period);
      });

      renderFacebookChart(fakeAccountsData);
    } catch (error) {
      console.error('Error loading Facebook data:', error);
      document.getElementById('facebookBotChart').innerHTML = 
        '<p style="text-align: center; color: #888;">Unable to load chart data</p>';
    }
  }

  function renderTikTokChart(data) {
    const container = document.getElementById('tiktokBotChart');
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
        <h3 style="margin: 0; color: #202124;">Fake & Inauthentic Accounts Removed</h3>
        <span class="info-badge" style="background: rgba(0, 242, 234, 0.15); color: #00a6a0; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: help;" title="Data from TikTok Transparency Reports (2020-2023). Includes accounts removed for violating community guidelines and fake engagement.">TikTok Data</span>
      </div>
    `;
    
    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = container.offsetWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select('#tiktokBotChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .range([height, 0]);

    // Gradient for bars
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'tiktokBarGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00f2ea')
      .attr('stop-opacity', 0.9);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff0050')
      .attr('stop-opacity', 0.9);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', '#202124');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => {
        if (d >= 1000000) return (d / 1000000).toFixed(1) + 'M';
        if (d >= 1000) return (d / 1000).toFixed(1) + 'K';
        return d;
      }))
      .selectAll('text')
      .style('fill', '#202124');

    // Grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(6)
        .tickSize(-width)
        .tickFormat('')
      )
      .selectAll('line')
      .style('stroke', '#e8eaed')
      .style('stroke-opacity', 0.3);

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.period))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', 'url(#tiktokBarGradient)')
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 0.7);
        
        const tooltip = d3.select('body').append('div')
          .attr('class', 'chart-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', '#fff')
          .style('padding', '8px 12px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '10000');
        
        tooltip.html(`
          <strong>${d.period}</strong><br/>
          Accounts Removed: ${(d.value / 1000000).toFixed(2)}M
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 1);
        d3.selectAll('.chart-tooltip').remove();
      });

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 15)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#202124')
      .style('font-size', '12px')
      .text('Accounts Removed');
  }

  function renderFacebookChart(data) {
    const container = document.getElementById('facebookBotChart');
    
    // Add interactive controls and title
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <h3 style="margin: 0; color: #202124;">Fake Accounts Removed per Quarter</h3>
          <span class="info-badge" style="background: #e8f0fe; color: #1a73e8; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: help;" title="Data from Meta Transparency Reports (2017-2022). Includes accounts removed for violating authenticity policies.">Meta Data</span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button id="fbChartToggle" style="padding: 0.5rem 1rem; background: #1877f2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 500;">Toggle Animation</button>
        </div>
      </div>
      <div id="fbChartContainer"></div>
    `;
    
    const margin = { top: 20, right: 30, bottom: 70, left: 90 };
    const width = container.offsetWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#fbChartContainer')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, width])
      .padding(0.2);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .nice()
      .range([height, 0]);

    // Add gradient for bars
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'fbBarGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1877f2')
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0c5bb5')
      .attr('stop-opacity', 1);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(8)
        .tickSize(-width)
        .tickFormat('')
      )
      .selectAll('line')
      .style('stroke', '#e8eaed')
      .style('stroke-opacity', 0.5);

    // Draw bars with animation
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'fb-bar')
      .attr('x', d => x(d.period))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', 'url(#fbBarGradient)')
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7)
          .attr('y', y(d.value) - 5)
          .attr('height', height - y(d.value) + 5);

        const tooltip = d3.select('body').append('div')
          .attr('class', 'chart-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.9)')
          .style('color', '#fff')
          .style('padding', '12px 16px')
          .style('border-radius', '8px')
          .style('font-size', '13px')
          .style('pointer-events', 'none')
          .style('z-index', '10000')
          .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)');

        const text = (d.value >= 1e9) 
          ? (d.value / 1e9).toFixed(2) + ' Billion' 
          : (d.value / 1e6).toFixed(0) + ' Million';

        tooltip.html(`
          <div style="font-weight: 600; margin-bottom: 4px;">${d.period}</div>
          <div>Accounts Removed: <strong>${text}</strong></div>
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('y', y(d.value))
          .attr('height', height - y(d.value));
        
        d3.selectAll('.chart-tooltip').remove();
      })
      .on('click', function(event, d) {
        alert(`${d.period}: ${(d.value / 1e9).toFixed(2)} Billion fake accounts removed\n\nSource: Meta Transparency Report`);
      });

    // Animate bars on load
    bars.transition()
      .duration(1000)
      .delay((d, i) => i * 30)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(
        data.filter((d, i) => i % 2 === 0).map(d => d.period)
      ))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', '#202124')
      .style('font-size', '11px')
      .style('font-weight', '500');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(y)
        .ticks(8)
        .tickFormat(d => {
          if (d >= 1e9) return (d / 1e9).toFixed(1) + 'B';
          if (d >= 1e6) return (d / 1e6).toFixed(0) + 'M';
          return d;
        })
      )
      .selectAll('text')
      .style('fill', '#202124')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 20)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#202124')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .text('Fake Accounts Removed');

    // Toggle button functionality
    const toggleBtn = document.getElementById('fbChartToggle');
    let animationEnabled = true;
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        animationEnabled = !animationEnabled;
        toggleBtn.textContent = animationEnabled ? 'Disable Animation' : 'Enable Animation';
        toggleBtn.style.background = animationEnabled ? 
          'linear-gradient(135deg, #1877f2, #0c5bb5)' : 
          'linear-gradient(135deg, #5f6368, #3c4043)';
      });
    }

    // Stats summary
    const maxVal = d3.max(data, d => d.value);
    const minVal = d3.min(data, d => d.value);
    const avgVal = d3.mean(data, d => d.value);
    const totalVal = d3.sum(data, d => d.value);

    const statsDiv = d3.select(container)
      .append('div')
      .style('margin-top', '20px')
      .style('padding', '16px')
      .style('background', '#f8f9fa')
      .style('border-radius', '8px')
      .style('display', 'grid')
      .style('grid-template-columns', 'repeat(auto-fit, minmax(150px, 1fr))')
      .style('gap', '12px');

    const stats = [
      { label: 'Peak Quarter', value: `${(maxVal / 1e9).toFixed(2)}B` },
      { label: 'Lowest Quarter', value: `${(minVal / 1e6).toFixed(0)}M` },
      { label: 'Average/Quarter', value: `${(avgVal / 1e9).toFixed(2)}B` },
      { label: 'Total Removed', value: `${(totalVal / 1e9).toFixed(1)}B` }
    ];

    stats.forEach(stat => {
      const statBox = statsDiv.append('div')
        .style('text-align', 'center')
        .style('padding', '8px');
      
      statBox.append('div')
        .style('font-size', '11px')
        .style('color', '#5f6368')
        .style('margin-bottom', '4px')
        .text(stat.label);
      
      statBox.append('div')
        .style('font-size', '20px')
        .style('font-weight', '700')
        .style('color', '#1877f2')
        .text(stat.value);
    });
  }

  function openDashboardFor(platform) {
    const key = platformData[platform] ? platform : 'twitter';
    renderDashboard(key);
    modal.style.display = 'flex';
    modal.setAttribute('data-open', 'true');
    body.style.overflow = 'hidden';
  }

  // Open dashboard when clicking platform icon
  platformIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const platform = icon.dataset.platform;
      openDashboardFor(platform);
    });
  });

  // Delegate as a backup (helps if icons are added dynamically)
  if (platformGrid) {
    platformGrid.addEventListener('click', (e) => {
      const icon = e.target.closest('.platform-icon');
      if (!icon) return;
      openDashboardFor(icon.dataset.platform);
    });
  }

  // Capture clicks anywhere on the document as a fallback (e.g., if icons are dynamically injected)
  document.addEventListener('click', (e) => {
    const icon = e.target.closest('.platform-icon');
    if (!icon) return;
    openDashboardFor(icon.dataset.platform);
  });

  // Change platform via dropdown
  platformSelector.addEventListener('change', (e) => {
    renderDashboard(e.target.value);
  });

  // Compare platforms functionality
  const compareBtn = document.getElementById('compareBtn');
  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      renderComparisonView();
    });
  }

  // Keyboard shortcuts help
  const helpBtn = document.getElementById('keyboardHelpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      showKeyboardShortcuts();
    });
  }

  function showKeyboardShortcuts() {
    const helpOverlay = document.createElement('div');
    helpOverlay.className = 'keyboard-shortcuts-overlay';
    helpOverlay.innerHTML = `
      <div class="shortcuts-modal">
        <div class="shortcuts-header">
          <h3>⌨️ Keyboard Shortcuts</h3>
          <button class="close-shortcuts">✕</button>
        </div>
        <div class="shortcuts-grid">
          <div class="shortcut-item">
            <kbd>ESC</kbd>
            <span>Close dashboard</span>
          </div>
          <div class="shortcut-item">
            <kbd>1</kbd> - <kbd>6</kbd>
            <span>Switch to platform (Twitter, Facebook, Instagram, TikTok, Reddit, YouTube)</span>
          </div>
          <div class="shortcut-item">
            <kbd>←</kbd> <kbd>→</kbd>
            <span>Navigate between platforms</span>
          </div>
          <div class="shortcut-item">
            <kbd>C</kbd>
            <span>Open comparison view</span>
          </div>
          <div class="shortcut-item">
            <kbd>Hover</kbd>
            <span>Hover over stat cards to see detailed context</span>
          </div>
        </div>
        <div class="shortcuts-footer">
          <p>💡 Tip: All shortcuts work only when the dashboard is open</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(helpOverlay);
    
    setTimeout(() => helpOverlay.classList.add('visible'), 10);
    
    // Close functionality
    const closeBtn = helpOverlay.querySelector('.close-shortcuts');
    const closeHelp = () => {
      helpOverlay.classList.remove('visible');
      setTimeout(() => helpOverlay.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeHelp);
    helpOverlay.addEventListener('click', (e) => {
      if (e.target === helpOverlay) closeHelp();
    });
    
    // Close with ESC
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeHelp();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  function getTransparencyScore(platform) {
    // Based on research findings and audit results
    const scores = {
      twitter: 35,   // Failed 2024 audits, reactive only
      facebook: 65,  // Has transparency reports, but gaps in enforcement
      instagram: 55, // Moderate transparency, high fake follower rates
      tiktok: 40,    // Highest detection difficulty, limited transparency
      reddit: 45,    // Failed audits, but allows good bots
      youtube: 60    // Decent reporting on fake views/subscribers
    };
    return scores[platform] || 50;
  }

  function getTransparencyLabel(platform) {
    const score = getTransparencyScore(platform);
    if (score >= 70) return 'High';
    if (score >= 50) return 'Moderate';
    if (score >= 30) return 'Low';
    return 'Very Low';
  }

  function renderComparisonView() {
    const platforms = Object.keys(platformData);
    
    dashboardContent.innerHTML = `
      <div class="comparison-header">
        <h2>🔍 Platform Comparison</h2>
        <p class="comparison-subtitle">Side-by-side analysis of bot activity across major social media platforms</p>
      </div>

      <div class="data-methodology-notice">
        <div class="notice-icon">⚠️</div>
        <div class="notice-content">
          <strong>Comparing Platforms:</strong> Direct comparisons are challenging due to different reporting standards, 
          time periods, and definitions. Twitter may report \"bot accounts,\" Facebook tracks \"fake accounts,\" 
          Instagram measures \"inauthentic behavior,\" and TikTok counts \"policy violations.\" Each metric reflects 
          the platform's unique ecosystem and enforcement approach. Use these comparisons to understand relative 
          scale and transparency rather than precise head-to-head metrics.
        </div>
      </div>

      <div class="comparison-grid">
        ${platforms.map(platform => {
          const data = platformData[platform];
          return `
            <div class="comparison-card ${data.colorClass}">
              <div class="comparison-platform-header">
                <div class="platform-icon-compare">${data.icon}</div>
                <h3>${data.name}</h3>
                <span class="platform-tag">${data.category}</span>
              </div>
              
              <div class="comparison-stats">
                <h4>Key Statistics</h4>
                ${Object.entries(data.stats).slice(0, 3).map(([key, value]) => `
                  <div class="comparison-stat-row" title="${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}">
                    <span class="stat-key">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span class="stat-val">${value}</span>
                  </div>
                `).join('')}
              </div>

              <div class="transparency-score">
                <div class="score-label">Transparency Level</div>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${getTransparencyScore(platform)}%"></div>
                </div>
                <div class="score-text">${getTransparencyLabel(platform)}</div>
              </div>
              
              <div class="comparison-verdict">
                <strong>Key Finding:</strong>
                <p>${data.researchFindings[0] || 'N/A'}</p>
              </div>
              
              <button class="view-details-btn" data-platform="${platform}">
                View Full Details →
              </button>
            </div>
          `;
        }).join('')}
      </div>

      <div class="comparison-summary">
        <h3>📊 Overall Analysis</h3>
        <div class="summary-grid">
          <div class="summary-card" data-detail="Detection rates vary widely: TikTok has the lowest (20-30% effective), while Facebook leads at ~65% through AI and human review. All platforms struggle with AI-generated content.">
            <div class="summary-icon">⚠️</div>
            <div class="summary-content">
              <h4>Most Critical Issue</h4>
              <p>Bot detection rates across all platforms remain below 50%, allowing massive fake engagement to persist</p>
              <div class="detail-hint">💡 Hover for details</div>
            </div>
          </div>
          
          <div class="summary-card" data-detail="2024 Stanford Internet Observatory and NewsGuard studies found Twitter/X, Reddit, and TikTok failed transparency standards. Facebook and YouTube provide most comprehensive reports.">
            <div class="summary-icon">🔍</div>
            <div class="summary-content">
              <h4>Independent Audits</h4>
              <p>Multiple platforms failed transparency audits in 2024, with actual bot rates significantly higher than claimed</p>
              <div class="detail-hint">💡 Hover for details</div>
            </div>
          </div>
          
          <div class="summary-card" data-detail="GPT-4 and other LLMs enable bots to pass CAPTCHA tests, write human-like comments, and evade detection. Cost of running bot operations has decreased 80% since 2020.">
            <div class="summary-icon">📈</div>
            <div class="summary-content">
              <h4>Growing Problem</h4>
              <p>AI-powered bots are becoming more sophisticated, making detection increasingly difficult for automated systems</p>
              <div class="detail-hint">💡 Hover for details</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners for view details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.target.dataset.platform;
        renderDashboard(platform);
      });
    });

    // Add hover details for summary cards
    document.querySelectorAll('.summary-card[data-detail]').forEach(card => {
      card.addEventListener('mouseenter', function() {
        const detail = this.dataset.detail;
        if (!detail) return;

        const detailDiv = document.createElement('div');
        detailDiv.className = 'summary-detail-popup';
        detailDiv.textContent = detail;
        this.appendChild(detailDiv);
        
        setTimeout(() => detailDiv.classList.add('visible'), 10);
      });

      card.addEventListener('mouseleave', function() {
        const popup = this.querySelector('.summary-detail-popup');
        if (popup) {
          popup.classList.remove('visible');
          setTimeout(() => popup.remove(), 200);
        }
      });
    });
  }

  // Close dashboard
  function closeDashboardModal() {
    modal.style.display = 'none';
    modal.removeAttribute('data-open');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDashboardModal);
  }
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeDashboardModal();
    }
  });

  // Keyboard shortcuts for dashboard
  document.addEventListener('keydown', (e) => {
    // Only work when dashboard is open
    if (modal.style.display !== 'flex') return;
    
    // Escape to close
    if (e.key === 'Escape') {
      closeDashboardModal();
      return;
    }
    
    // Number keys 1-6 to switch platforms
    if (e.key >= '1' && e.key <= '6') {
      const platforms = ['twitter', 'facebook', 'instagram', 'tiktok', 'reddit', 'youtube'];
      const platform = platforms[parseInt(e.key) - 1];
      renderDashboard(platform);
      return;
    }
    
    // C to compare
    if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      document.getElementById('compareBtn')?.click();
      return;
    }
    
    // Arrow keys to navigate platforms
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const platforms = ['twitter', 'facebook', 'instagram', 'tiktok', 'reddit', 'youtube'];
      const currentPlatform = platformSelector.value;
      const currentIndex = platforms.indexOf(currentPlatform);
      
      let newIndex;
      if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + platforms.length) % platforms.length;
      } else {
        newIndex = (currentIndex + 1) % platforms.length;
      }
      
      renderDashboard(platforms[newIndex]);
      return;
    }
  });

  // Search dropdown functionality
  const searchTrigger = document.getElementById('searchDropdownTrigger');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchInput = document.getElementById('platformSearch');

  if (searchTrigger && searchDropdown && searchInput) {
    searchTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      searchTrigger.classList.toggle('active');
      searchDropdown.classList.toggle('active');
      if (searchDropdown.classList.contains('active')) {
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchTrigger.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchTrigger.classList.remove('active');
        searchDropdown.classList.remove('active');
      }
    });

    // Optional: Filter platforms as user types
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      platformIcons.forEach(icon => {
        const platformName = icon.dataset.platform.toLowerCase();
        const label = icon.querySelector('.icon-label').textContent.toLowerCase();
        if (platformName.includes(searchTerm) || label.includes(searchTerm)) {
          icon.style.display = 'flex';
        } else {
          icon.style.display = searchTerm ? 'none' : 'flex';
        }
      });
    });
  }

});})
