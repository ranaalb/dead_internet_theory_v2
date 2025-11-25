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

// Wait for DOM content to be loaded before creating the pie chart
// NOTE: This chart is disabled as the #chart element is commented out in HTML
/*
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('Creating pie chart...');

    // Dimensions and radius
    const width = 600, height = 600, radius = Math.min(width, height) / 2;

    // Color scheme
    const color = d3.scaleOrdinal()
      .domain(["Human", "Bot"])
      .range(["#286cd8ff", "#ec1010ff"]);

    // Create the SVG container
    const chartDiv = document.getElementById('chart');
    if (!chartDiv) {
      console.error('#chart element not found');
      return;
    }

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius - 20);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.count);

    // Sample data
    const data = [
      { type: "Human", count: 96.76 },
      { type: "Bot", count: 3.24 }
    ];

    console.log('Data for pie chart:', data);

    // Create pie slices
    const arcs = pie(data);

    // Add paths
    svg.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("fill", d => color(d.data.type))
      .attr("d", arc)
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    // Add labels
    svg.selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => `${d.data.type} (${((d.data.count / d3.sum(data, d=>d.count))*100).toFixed(1)}%)`);

    console.log('Pie chart created successfully');
  } catch (error) {
    console.error('Error creating pie chart:', error);
    const chartEl = document.getElementById('chart');
    if (chartEl) {
      chartEl.innerHTML = '<p style="color:#fff; text-align:center; padding:2rem;">Error creating pie chart. Check console for details.</p>';
    }
  }
});
*/

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
document.addEventListener('DOMContentLoaded', () => {
  const trafficDiv = d3.select("#traffic-chart");
  
  if (trafficDiv.empty()) {
    console.warn('No #traffic-chart element found; skipping chart');
    return;
  }

  // Data from the chart (percentages for each category per year)
  const data = [
    { year: 2015, human: 54, goodBot: 27, badBot: 15 },
    { year: 2016, human: 61, goodBot: 19, badBot: 20 },
    { year: 2017, human: 58, goodBot: 20, badBot: 22 },
    { year: 2018, human: 62, goodBot: 18, badBot: 20 },
    { year: 2019, human: 63, goodBot: 13, badBot: 24 },
    { year: 2020, human: 59, goodBot: 15, badBot: 26 },
    { year: 2021, human: 58, goodBot: 15, badBot: 28 },
    { year: 2022, human: 53, goodBot: 17, badBot: 30 },
    { year: 2023, human: 50, goodBot: 18, badBot: 33 },
    { year: 2024, human: 49, goodBot: 14, badBot: 37 }
  ];

  const margin = { top: 50, right: 150, bottom: 60, left: 80 };
  const width = 1200 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = trafficDiv
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .style("fill", "#fff")
    .text("Internet Traffic Composition (2015-2024)");

  // Create tooltip
  const tooltip = trafficDiv
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.9)")
    .style("color", "#fff")
    .style("padding", "10px 15px")
    .style("border-radius", "8px")
    .style("font-size", "14px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("box-shadow", "0 4px 12px rgba(0,0,0,0.5)")
    .style("transition", "opacity 0.2s")
    .style("z-index", "1000");

  // Scales
  const x = d3.scaleLinear()
    .domain([2015, 2024])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

  // Stack the data
  const stack = d3.stack()
    .keys(["badBot", "goodBot", "human"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const series = stack(data);

  // Define gradients
  const defs = svg.append("defs");
  
  const humanGradient = defs.append("linearGradient")
    .attr("id", "humanGradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  humanGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#00D4FF")
    .attr("stop-opacity", 1);
  humanGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0099CC")
    .attr("stop-opacity", 1);

  const goodBotGradient = defs.append("linearGradient")
    .attr("id", "goodBotGradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  goodBotGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#E91E8C")
    .attr("stop-opacity", 1);
  goodBotGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#C71866")
    .attr("stop-opacity", 1);

  const badBotGradient = defs.append("linearGradient")
    .attr("id", "badBotGradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  badBotGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#00C896")
    .attr("stop-opacity", 1);
  badBotGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#009975")
    .attr("stop-opacity", 1);

  // Colors mapping
  const colors = {
    human: "url(#humanGradient)",
    goodBot: "url(#goodBotGradient)",
    badBot: "url(#badBotGradient)"
  };
  
  const solidColors = {
    human: "#00D4FF",
    goodBot: "#E91E8C",
    badBot: "#00C896"
  };

  // Area generator
  const area = d3.area()
    .x(d => x(d.data.year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveMonotoneX);

  // Draw areas with animations and interactivity
  svg.selectAll(".area")
    .data(series)
    .join("path")
    .attr("class", "area")
    .attr("d", area)
    .style("fill", d => colors[d.key])
    .style("opacity", 0)
    .style("cursor", "pointer")
    .style("transition", "opacity 0.3s ease, filter 0.3s ease")
    .transition()
    .duration(1000)
    .delay((d, i) => i * 200)
    .style("opacity", 0.85)
    .on("end", function(d) {
      d3.select(this)
        .transition()
        .duration(2000)
        .style("opacity", 0.9);
      
      // Add hover effects after animation
      d3.select(this)
        .on("mouseover", function() {
          d3.select(this)
            .style("opacity", 1)
            .style("filter", "brightness(1.2)");
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("opacity", 0.9)
            .style("filter", "brightness(1)");
        });
    });

  // Add percentage labels on the areas with animation
  series.forEach((serie, i) => {
    data.forEach((d, j) => {
      const value = serie[j][1] - serie[j][0];
      const xPos = x(d.year);
      const yPos = y(serie[j][0] + value / 2);
      
      // Only show percentage if value is significant enough
      if (value >= 10) {
        svg.append("text")
          .attr("x", xPos)
          .attr("y", yPos)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "#fff")
          .style("font-size", "18px")
          .style("font-weight", "bold")
          .style("pointer-events", "none")
          .style("text-shadow", "0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1)")
          .style("opacity", 0)
          .text(`${value}%`)
          .transition()
          .duration(500)
          .delay(i * 200 + 1000 + j * 50)
          .style("opacity", 1);
      }
    });
  });

  // Add interactive data points
  data.forEach((d, i) => {
    const pointGroup = svg.append("g")
      .attr("class", "data-point-group")
      .style("opacity", 0);

    // Add invisible hover area
    pointGroup.append("rect")
      .attr("x", x(d.year) - 20)
      .attr("y", 0)
      .attr("width", 40)
      .attr("height", height)
      .style("fill", "transparent")
      .style("cursor", "pointer")
      .on("mouseover", function(event) {
        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${d.year}</strong><br/>
            <span style="color: #00D4FF;">●</span> Human: ${d.human}%<br/>
            <span style="color: #00C896;">●</span> Bad Bot: ${d.badBot}%<br/>
            <span style="color: #E91E8C;">●</span> Good Bot: ${d.goodBot}%
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
        
        // Highlight vertical line
        d3.select(this.parentNode).select("line")
          .style("opacity", 0.5);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("opacity", 0);
        d3.select(this.parentNode).select("line")
          .style("opacity", 0);
      });

    // Add subtle vertical line
    pointGroup.append("line")
      .attr("x1", x(d.year))
      .attr("x2", x(d.year))
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "4,4")
      .style("opacity", 0)
      .style("pointer-events", "none");

    pointGroup
      .transition()
      .duration(500)
      .delay(2500 + i * 50)
      .style("opacity", 1);
  });

  // X Axis
  const xAxis = d3.axisBottom(x)
    .tickValues([2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024])
    .tickFormat(d3.format("d"));

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "16px")
    .style("fill", "#fff");

  svg.selectAll(".domain, .tick line")
    .style("stroke", "#fff");

  // Add X-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .style("fill", "#fff")
    .text("Year");

  // Y Axis
  const yAxis = d3.axisLeft(y)
    .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    .tickFormat(d => `${d}%`);

  svg.append("g")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "16px")
    .style("fill", "#fff");

  svg.selectAll(".domain, .tick line")
    .style("stroke", "#fff");

  // Add Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .style("fill", "#fff")
    .text("Percentage of Internet Traffic");

  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width + 30}, ${height / 2 - 60})`);

  const legendData = [
    { key: "human", label: "Human" },
    { key: "badBot", label: "Bad Bot" },
    { key: "goodBot", label: "Good Bot" }
  ];

  legendData.forEach((item, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 35})`);

    legendRow.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 10)
      .style("fill", solidColors[item.key])
      .style("opacity", 0)
      .transition()
      .duration(500)
      .delay(2000 + i * 100)
      .style("opacity", 1);

    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .style("font-size", "18px")
      .style("fill", "#fff")
      .style("font-weight", "600")
      .text(item.label);
  });
});

// ========== BOT ENGAGEMENT CHARTS ==========
// NOTE: This chart is disabled as the #chart-ignored element is commented out in HTML
/*
document.addEventListener('DOMContentLoaded', async () => {
  const chartDiv = d3.select("#chart");
  const tooltip = d3.select(".tooltip");

  if (chartDiv.empty()) {
    console.warn('No #chart element found; skipping chart');
    return;
  }

  const width = 900, height = 450;

  // Show loading message
  const loadingText = chartDiv.append('div')
    .style('color', 'white')
    .style('text-align', 'center')
    .style('padding', '2rem')
    .style('font-size', '18px')
    .text('Loading data...');

  try {
    // Load CSV data
    const data = await d3.csv('Datasets/Features_For_Traditional_ML_Techniques.csv');
    console.log('CSV loaded. Rows:', data.length);

    // Analyze bot vs human engagement
    let botZeroRetweets = 0;
    let humanZeroRetweets = 0;
    let botTotal = 0;
    let humanTotal = 0;
    let botTotalRetweets = 0;
    let humanTotalRetweets = 0;

    data.forEach(row => {
      const botBinary = row.BotScoreBinary ? row.BotScoreBinary.trim() : '';
      const retweetsStr = row.retweets ? row.retweets.trim() : '';

      if (botBinary && retweetsStr) {
        try {
          const isBot = parseFloat(botBinary) === 1.0;
          const retweets = parseFloat(retweetsStr);

          if (isBot) {
            botTotal++;
            botTotalRetweets += retweets;
            if (retweets === 0.0) botZeroRetweets++;
          } else {
            humanTotal++;
            humanTotalRetweets += retweets;
            if (retweets === 0.0) humanZeroRetweets++;
          }
        } catch (e) {
          // Skip invalid rows
        }
      }
    });

    const botZeroPct = botTotal > 0 ? (botZeroRetweets / botTotal * 100) : 0;
    const humanZeroPct = humanTotal > 0 ? (humanZeroRetweets / humanTotal * 100) : 0;
    const totalRetweets = botTotalRetweets + humanTotalRetweets;
    const botEngagementPct = totalRetweets > 0 ? (botTotalRetweets / totalRetweets * 100) : 0;

    console.log('Bot accounts:', botTotal);
    console.log('Human accounts:', humanTotal);
    console.log('Bots with zero retweets:', botZeroPct.toFixed(1) + '%');
    console.log('Humans with zero retweets:', humanZeroPct.toFixed(1) + '%');
    console.log('Bot retweet engagement:', botEngagementPct.toFixed(4) + '%');

    loadingText.remove();

    const dataset = [
      { type: 'Bots', percentage: botZeroPct },
      { type: 'Humans', percentage: humanZeroPct }
    ];

    const donutData = [
      { type: 'Bots', value: botEngagementPct },
      { type: 'Humans', value: 100 - botEngagementPct }
    ];

    console.log('Chart data loaded');
    console.log('Bar chart:', dataset);
    console.log('Donut chart:', donutData);

    try {
      // Create container for both charts side by side
      const containerDiv = chartDiv.append("div")
        .style("display", "flex")
        .style("flex-direction", "row")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("gap", "40px")
        .style("flex-wrap", "nowrap")
        .style("padding", "20px")
        .style("max-width", "100%")
        .style("margin", "0 auto");

      // ========== BAR CHART: Tweets with Zero Retweets ==========
      const barWidth = 450, barHeight = 420;
      const barMargin = { top: 70, right: 25, bottom: 70, left: 90 };

      const barSvg = containerDiv.append("svg")
        .attr("width", barWidth)
        .attr("height", barHeight)
        .style("background", "rgba(255, 255, 255, 0.03)")
        .style("border-radius", "16px")
        .style("box-shadow", "0 8px 20px rgba(0, 0, 0, 0.5)")
        .style("border", "1px solid rgba(255, 255, 255, 0.1)");

      const barG = barSvg.append("g")
        .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

      const barInnerWidth = barWidth - barMargin.left - barMargin.right;
      const barInnerHeight = barHeight - barMargin.top - barMargin.bottom;

      const x = d3.scaleBand()
        .domain(dataset.map(d => d.type))
        .range([0, barInnerWidth])
        .padding(0.4);

      const y = d3.scaleLinear()
        .domain([0, 100])
        .range([barInnerHeight, 0]);

      // Grid lines
      barG.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
          .tickSize(-barInnerWidth)
          .tickFormat("")
        )
        .selectAll("line")
        .style("stroke", "rgba(255,255,255,0.1)")
        .style("stroke-dasharray", "3,3");

      barG.selectAll(".grid .domain")
        .style("stroke", "none");

      // Axes
      barG.append("g")
        .attr("transform", `translate(0,${barInnerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "17px")
        .style("font-weight", "700")
        .style("fill", "white");

      barG.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%").ticks(5))
        .selectAll("text")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .style("fill", "#e0e0e0");

      // Style axis lines and ticks
      barG.selectAll(".domain")
        .style("stroke", "rgba(255,255,255,0.4)")
        .style("stroke-width", "2px");
      
      barG.selectAll(".tick line")
        .style("stroke", "rgba(255,255,255,0.25)");

      // Bars with animation
      barG.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.type))
        .attr("width", x.bandwidth())
        .attr("y", barInnerHeight)
        .attr("height", 0)
        .attr("fill", d => d.type === "Bots" ? "#ec1010ff" : "#286cd8ff")
        .attr("rx", 6)
        .attr("ry", 6)
        .style("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))")
        .transition()
        .duration(1500)
        .ease(d3.easeCubicOut)
        .attr("y", d => y(d.percentage))
        .attr("height", d => barInnerHeight - y(d.percentage));

      // Labels on bars
      barG.selectAll(".bar-label")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.type) + x.bandwidth() / 2)
        .attr("y", d => y(d.percentage) - 15)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "26px")
        .attr("font-weight", "bold")
        .style("text-shadow", "0 3px 6px rgba(0,0,0,0.7)")
        .text(d => d.percentage.toFixed(1) + "%");

      // Chart subtitle
      barG.append("text")
        .attr("x", barInnerWidth / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .style("letter-spacing", "0.5px")
        .text("Most bot tweets get no retweets");

      // Y-axis label
      barG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -barInnerHeight / 2)
        .attr("y", -70)
        .attr("text-anchor", "middle")
        .attr("fill", "#b0b0b0")
        .attr("font-size", "13px")
        .attr("font-weight", "500")
        .text("Percent of tweets with zero retweets");

      // ========== DONUT CHART: Retweet Engagement Composition ==========
      const donutWidth = 450, donutHeight = 420;
      const donutRadius = Math.min(donutWidth, donutHeight) / 2 - 60;

      const donutSvg = containerDiv.append("svg")
        .attr("width", donutWidth)
        .attr("height", donutHeight)
        .style("background", "rgba(255, 255, 255, 0.03)")
        .style("border-radius", "16px")
        .style("box-shadow", "0 8px 20px rgba(0, 0, 0, 0.5)")
        .style("border", "1px solid rgba(255, 255, 255, 0.1)");

      const donutG = donutSvg.append("g")
        .attr("transform", `translate(${donutWidth / 2},${donutHeight / 2 + 15})`);

      const color = d3.scaleOrdinal()
        .domain(["Bots", "Humans"])
        .range(["#ec1010ff", "#286cd8ff"]);

      const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

      const arc = d3.arc()
        .innerRadius(donutRadius * 0.6)
        .outerRadius(donutRadius);

      // Draw donut slices
      const paths = donutG.selectAll("path")
        .data(pie(donutData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.type))
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .style("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))")
        .style("opacity", 0);

      paths.transition()
        .duration(1500)
        .ease(d3.easeCubicOut)
        .style("opacity", 1)
        .attrTween("d", function(d) {
          const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return function(t) { return arc(i(t)); };
        });

      // Center text
      donutG.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -18)
        .attr("fill", "#ec1010ff")
        .attr("font-size", "24px")
        .attr("font-weight", "bold")
        .style("text-shadow", "0 3px 6px rgba(0,0,0,0.7)")
        .text(`Bots = ${donutData[0].value.toFixed(4)}%`);

      donutG.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 8)
        .attr("fill", "white")
        .attr("font-size", "15px")
        .attr("font-weight", "500")
        .text("of all retweet engagement");

      // Chart title
      donutG.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -donutRadius - 45)
        .attr("fill", "white")
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .style("letter-spacing", "0.5px")
        .text("Bots are 0.0555% of all retweet engagement");

      donutG.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -donutRadius - 23)
        .attr("fill", "#b0b0b0")
        .attr("font-size", "13px")
        .attr("font-weight", "500")
        .text("Composition of total retweets");

      // Legend
      const legend = donutSvg.append("g")
        .attr("transform", `translate(${donutWidth - 115}, ${donutHeight - 75})`);

      const legendData = [
        { label: "Bots", color: "#ec1010ff" },
        { label: "Humans", color: "#286cd8ff" }
      ];

      legendData.forEach((d, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 28})`);

        legendRow.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("rx", 4)
          .attr("fill", d.color)
          .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.4))");

        legendRow.append("text")
          .attr("x", 26)
          .attr("y", 13)
          .attr("fill", "white")
          .attr("font-size", "15px")
          .attr("font-weight", "600")
          .text(d.label);
      });

      console.log('Charts rendered successfully!');
      
    } catch (renderError) {
      console.error('Error rendering charts:', renderError);
      chartDiv.html('').append('div')
        .style('color', '#ff6b6b')
        .style('text-align', 'center')
        .style('padding', '2rem')
        .text('Error rendering charts. Check console for details.');
    }
  } catch (loadError) {
    console.error('Error loading data:', loadError);
    loadingText
      .style('color', '#ff6b6b')
      .text('Error loading data. Check console for details.');
  }
});
*/

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
  let currentZoomRange = null;
  
  // Add a test element to verify the container is working
  chartContainer.innerHTML = '<div style="background: rgba(29, 155, 240, 0.2); padding: 20px; text-align: center; color: white;">Chart container is ready...</div>';
  
  let currentData = [];
  let svg, xScale, yScale, line, area, path, dots, peakCircle, peakLabel;
  
  // Country data configuration
  const countryData = {
    'us': { name: 'United States', flag: '🇺🇸', color: '#1f77b4', file: 'us_search.csv' },
    'uk': { name: 'United Kingdom', flag: '🇬🇧', color: '#ff7f0e', file: 'uk_search.csv' },
    'canada': { name: 'Canada', flag: '🇨🇦', color: '#2ca02c', file: 'canada_search.csv' },
    'australia': { name: 'Australia', flag: '🇦🇺', color: '#d62728', file: 'aus_search.csv' },
    'russia': { name: 'Russia', flag: '🇷🇺', color: '#9467bd', file: 'russia_search.csv' }
  };
  
  // Track which countries are currently visible
  let visibleCountries = new Set(['us', 'uk', 'canada', 'australia', 'russia']);
  let allCountryData = {};

  // Load data from CSV files
  async function loadCountryData() {
    try {
      console.log('Loading country data...');
      
      for (const [countryCode, country] of Object.entries(countryData)) {
        try {
          const data = await d3.csv(`Datasets/${country.file}`);
          
          const processedData = data
            .map(d => {
              // Handle the column name which includes the country name
              const dateStr = d.Week;
              const valueStr = Object.values(d).find(v => v !== dateStr);
              
              if (!dateStr || !valueStr) return null;
              
              const date = d3.timeParse('%Y-%m-%d')(dateStr.trim());
              const value = +valueStr;
              
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
    // Combine data from all visible countries
    currentData = [];
    
    for (const countryCode of visibleCountries) {
      if (allCountryData[countryCode]) {
        currentData = currentData.concat(allCountryData[countryCode]);
      }
    }
    
    if (currentData.length === 0) {
      console.error('No data available');
      return;
    }
    
    console.log(`Combined data from ${visibleCountries.size} countries: ${currentData.length} points`);
    
    // Clear the container and render
    chartContainer.innerHTML = '';
    
    // Update stats, render chart, and setup controls
    updateStats(currentData);
    renderChart(currentData);
    setupControls(currentData);
    createCountryControls();
  }
  
  // Create flag button controls
  function createCountryControls() {
    const existingControls = document.getElementById('countryControls');
    if (existingControls) {
      existingControls.remove();
    }
    
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'countryControls';
    controlsContainer.style.cssText = `
      display: flex;
      gap: 10px;
      justify-content: center;
      margin: 20px 0;
      flex-wrap: wrap;
    `;
    
    for (const [countryCode, country] of Object.entries(countryData)) {
      const button = document.createElement('button');
      button.innerHTML = `${country.flag} ${country.name}`;
      button.style.cssText = `
        padding: 8px 16px;
        border: 2px solid ${country.color};
        border-radius: 25px;
        background: ${visibleCountries.has(countryCode) ? country.color + '30' : 'transparent'};
        color: ${visibleCountries.has(countryCode) ? 'white' : country.color};
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      
      button.addEventListener('click', () => toggleCountry(countryCode));
      button.addEventListener('mouseenter', () => {
        button.style.background = country.color + '50';
        button.style.transform = 'translateY(-2px)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = visibleCountries.has(countryCode) ? country.color + '30' : 'transparent';
        button.style.transform = 'translateY(0)';
      });
      
      controlsContainer.appendChild(button);
    }
    
    // Insert controls before the chart
    const chartContainer = document.getElementById('searchTrendChart');
    chartContainer.parentNode.insertBefore(controlsContainer, chartContainer);
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

  // Try to load the CSV file first, then fall back to embedded data
  console.log('Starting data loading process...');
  
  // For immediate testing, let's create a simple test chart first
  setTimeout(() => {
    chartContainer.innerHTML = '<div style="background: rgba(29, 155, 240, 0.2); padding: 20px; text-align: center; color: white;">Loading chart data...</div>';
    
    d3.text('search_traffic_worldwide_2020.csv')
      .then(text => {
        console.log('Successfully loaded CSV file from disk');
        chartContainer.innerHTML = '<div style="background: rgba(0, 255, 0, 0.2); padding: 20px; text-align: center; color: white;">CSV loaded successfully</div>';
        return processCSVText(text);
      })
      .catch(error => {
        console.warn('Could not load CSV file, using embedded data:', error);
        chartContainer.innerHTML = '<div style="background: rgba(255, 255, 0, 0.2); padding: 20px; text-align: center; color: white;">Using embedded data</div>';
        return processCSVText(csvData);
      });
  }, 1000);

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
      .style('background', 'rgba(0,0,0,0.1)') // Temporary background to see the chart area
      .style('margin', '0 auto')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create gradient for area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1D9BF0')
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1D9BF0')
      .attr('stop-opacity', 0.1);
    
    // Set up scales
    xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);
    
    yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.15])
      .range([height, 0]);
    
    // Add horizontal grid lines
    svg.append('g')
      .attr('class', 'chart-grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(''));
    
    // Add vertical grid lines for better clarity
    svg.append('g')
      .attr('class', 'chart-grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(14)
        .tickSize(-height)
        .tickFormat(''));
    
    // Create line generator
    line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Create area generator
    area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add area with fade-in animation
    const areaPath = svg.append('path')
      .datum(data)
      .attr('class', 'line-chart-area')
      .attr('d', area)
      .style('opacity', 0);
    
    areaPath.transition()
      .delay(500)
      .duration(1500)
      .style('opacity', 1);
    
    // Add line with enhanced drawing animation
    path = svg.append('path')
      .datum(data)
      .attr('class', 'line-chart-path')
      .attr('d', line);
    
    // Animate line drawing with stroke-dasharray
    const pathLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', pathLength + ' ' + pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(3000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
    
    // Add axes with readable text - dynamic formatting based on data range
    const dataRange = d3.extent(data, d => d.date);
    const daysDifference = (dataRange[1] - dataRange[0]) / (1000 * 60 * 60 * 24);
    
    // Use detailed date format for zoomed views (less than 120 days), month/year for full view
    const dateFormat = daysDifference <= 120 ? d3.timeFormat('%b %d, %Y') : d3.timeFormat('%b \'%y');
    const tickCount = daysDifference <= 120 ? 6 : 10;
    
    const xAxis = d3.axisBottom(xScale)
      .ticks(tickCount)
      .tickFormat(dateFormat)
      .tickSize(8)
      .tickPadding(8);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(8)
      .tickSize(8)
      .tickPadding(8);
    
    svg.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', daysDifference <= 120 ? 'middle' : 'end')
      .style('font-size', daysDifference <= 120 ? '10px' : '11px')
      .style('font-weight', '600')
      .attr('dx', daysDifference <= 120 ? '0' : '-.8em')
      .attr('dy', daysDifference <= 120 ? '1.2em' : '.15em')
      .attr('transform', daysDifference <= 120 ? 'rotate(0)' : 'rotate(-45)');
    
    svg.append('g')
      .attr('class', 'chart-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '600');
    
    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 52)
      .style('text-anchor', 'middle')
      .style('fill', '#E7E9EA')
      .style('font-size', '13px')
      .style('font-weight', '700')
      .style('letter-spacing', '0.5px')
      .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif')
      .text('Time Period');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .style('text-anchor', 'middle')
      .style('fill', '#E7E9EA')
      .style('font-size', '13px')
      .style('font-weight', '700')
      .style('letter-spacing', '0.5px')
      .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif')
      .text('Search Interest (Relative)');
    
    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip');
    
    // Add interactive dots - larger and more prominent with sequential animation
    const dotData = data.filter((d, i) => i % 3 === 0 || d.value > 30);
    dots = svg.selectAll('.chart-dot')
      .data(dotData)
      .enter()
      .append('circle')
      .attr('class', 'chart-dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 0)
      .style('opacity', 0)
      .transition()
      .duration(400)
      .delay((d, i) => 3000 * (i / dotData.length))
      .attr('r', 5)
      .style('opacity', 1);
    
    // Re-select dots for interactivity
    svg.selectAll('.chart-dot')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', 7);
        
        tooltip
          .html(`
            <div class="tooltip-date">${d3.timeFormat('%B %d, %Y')(d.date)}</div>
            <div class="tooltip-value">Search Interest: <strong>${d.value}</strong></div>
          `)
          .classed('visible', true);

        // Position tooltip and clamp to viewport so it doesn't get cut off
        positionTooltip(tooltip, event.pageX, event.pageY, 15, 15);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', 5);
        
        tooltip.classed('visible', false);
      })
      .on('click', function(event, d) {
        // Add click effect
        const circle = d3.select(this);
        circle
          .transition()
          .duration(300)
          .attr('r', 9)
          .transition()
          .duration(300)
          .attr('r', 5);
      });
    
    // Highlight sustained attention period (2023-2025)
    const sustainedStartDate = new Date('2023-01-01');
    const sustainedData = data.filter(d => d.date >= sustainedStartDate);
    
    // Add shaded region to show consistent attention
    if (sustainedData.length > 0) {
      const sustainedArea = svg.append('path')
        .datum(sustainedData)
        .attr('class', 'sustained-attention-area')
        .attr('d', d3.area()
          .x(d => xScale(d.date))
          .y0(height)
          .y1(d => yScale(d.value))
          .curve(d3.curveMonotoneX)
        )
        .style('fill', 'rgba(29, 155, 240, 0.15)')
        .style('opacity', 0)
        .transition()
        .delay(3200)
        .duration(800)
        .style('opacity', 1);
    }
    
    // Store current scale for zoom functionality
    window.currentXScale = xScale;
    window.currentYScale = yScale;
    
    // Store full dataset and current zoom range
    if (!fullDataset || data.length > (fullDataset?.length || 0) * 0.8) {
      fullDataset = [...data];
    }
    
    if (data.length > 0) {
      currentZoomRange = {
        start: d3.min(data, d => d.date),
        end: d3.max(data, d => d.date)
      };
    }
    
    // Render overview chart after main chart
    setTimeout(() => {
      renderOverviewChart();
    }, 500);
  }

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
    // Store current zoom range
    if (data.length > 0) {
      currentZoomRange = {
        start: d3.min(data, d => d.date),
        end: d3.max(data, d => d.date)
      };
    }
    
    // Update scales
    xScale.domain(d3.extent(data, d => d.date));
    yScale.domain([0, d3.max(data, d => d.value) * 1.15]);
    
    // Clear and re-render
    renderChart(data);
  }
  
  // Overview chart function
  function renderOverviewChart() {
    const overviewContainer = document.getElementById('overviewChart');
    if (!overviewContainer || !fullDataset || fullDataset.length === 0) return;
    
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
      .domain(d3.extent(fullDataset, d => d.date))
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(fullDataset, d => d.value))
      .range([height, 0]);
    
    // Create area generator
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add area
    svg.append('path')
      .datum(fullDataset)
      .attr('class', 'overview-area')
      .attr('d', area)
      .style('fill', 'rgba(29, 155, 240, 0.3)')
      .style('opacity', 0.6);
    
    // Add line
    svg.append('path')
      .datum(fullDataset)
      .attr('class', 'overview-line')
      .attr('d', line)
      .style('stroke', '#1D9BF0')
      .style('stroke-width', '2px')
      .style('fill', 'none');
    
    // Add selection indicator if we have current zoom range
    if (currentZoomRange && currentZoomRange.start && currentZoomRange.end) {
      const startX = xScale(currentZoomRange.start);
      const endX = xScale(currentZoomRange.end);
      
      // Clamp values to valid range
      const clampedStartX = Math.max(0, Math.min(width, startX));
      const clampedEndX = Math.max(0, Math.min(width, endX));
      
      // Add selection rectangle
      svg.append('rect')
        .attr('class', 'zoom-selection')
        .attr('x', clampedStartX)
        .attr('y', 0)
        .attr('width', Math.max(2, clampedEndX - clampedStartX))
        .attr('height', height)
        .style('fill', 'rgba(255, 107, 157, 0.4)')
        .style('stroke', '#ff6b9d')
        .style('stroke-width', '2px')
        .style('opacity', 0.8);
      
      // Add selection handles
      if (clampedStartX >= 0 && clampedStartX <= width) {
        svg.append('rect')
          .attr('class', 'zoom-handle-left')
          .attr('x', clampedStartX - 2)
          .attr('y', -2)
          .attr('width', 4)
          .attr('height', height + 4)
          .style('fill', '#ff6b9d')
          .style('cursor', 'ew-resize');
      }
      
      if (clampedEndX >= 0 && clampedEndX <= width) {
        svg.append('rect')
          .attr('class', 'zoom-handle-right')
          .attr('x', clampedEndX - 2)
          .attr('y', -2)
          .attr('width', 4)
          .attr('height', height + 4)
          .style('fill', '#ff6b9d')
          .style('cursor', 'ew-resize');
      }
    }
    
    // Create brush for zooming
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('brush end', function(event) {
        if (!event.selection) return;
        
        const [x0, x1] = event.selection;
        const domain = [xScale.invert(x0), xScale.invert(x1)];
        
        // Filter data based on brush selection
        const filteredData = fullDataset.filter(d => d.date >= domain[0] && d.date <= domain[1]);
        
        if (filteredData.length > 0) {
          // Update current zoom range
          currentZoomRange = {
            start: domain[0],
            end: domain[1]
          };
          
          // Update main chart with filtered data
          updateChart(filteredData);
        }
      });
    
    // Add brush
    const brushGroup = svg.append('g')
      .attr('class', 'brush')
      .call(brush);
    
    // Style brush to be less prominent
    brushGroup.selectAll('.selection')
      .style('opacity', 0.1);
    
    brushGroup.selectAll('.handle')
      .style('opacity', 0.3);
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
      name: 'Facebook adds first AI policy - everything has to say that it is made by AI (April 5th, 2024)',
      date: new Date('2024-04-05'),
      peakValue: 95,
      impact: 90, // Very high impact
      description: 'Very High Impact',
      articleUrl: 'https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/',
      showLine: true,
      zoomRange: {
        start: new Date('2024-03-15'),
        end: new Date('2024-04-25')
      }
    },
    'chatgpt-launch': {
      name: 'ChatGPT Launch (November 30th, 2022)',
      date: new Date('2022-11-30'),
      peakValue: 89,
      impact: 75, // Medium-high impact
      description: 'High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2022-11-01'),
        end: new Date('2022-12-31')
      }
    },
    'gpt4-release': {
      name: 'GPT-4 Release (March 14th, 2023)',
      date: new Date('2023-03-14'),
      peakValue: 142,
      impact: 85, // High impact
      description: 'Very High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2023-02-15'),
        end: new Date('2023-04-15')
      }
    },
    'bing-ai': {
      name: 'Bing AI Integration (February 7th, 2023)',
      date: new Date('2023-02-07'),
      peakValue: 78,
      impact: 45, // Medium impact
      description: 'Medium Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2023-01-15'),
        end: new Date('2023-03-15')
      }
    },
    'ai-regulation': {
      name: 'EU AI Act Discussions (June 2023)',
      date: new Date('2023-06-15'),
      peakValue: 156,
      impact: 80, // High impact
      description: 'High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2023-05-15'),
        end: new Date('2023-07-15')
      }
    },
    'twitter-bots': {
      name: 'Twitter Bot Purge (October 2022)',
      date: new Date('2022-10-15'),
      peakValue: 94,
      impact: 60, // Medium-high impact
      description: 'Medium-High Impact',
      showLine: true,
      zoomRange: {
        start: new Date('2022-09-15'),
        end: new Date('2022-11-15')
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
    
    const impact = event.impact;
    const fillWidth = `${impact}%`;
    const thumbPosition = `calc(${impact}% - 9px)`;
    
    // Update the visual indicator
    impactFill.style.width = fillWidth;
    impactThumb.style.left = thumbPosition;
    
    // Update impact value text
    const impactValue = document.getElementById('impactValue');
    if (impactValue) {
      const impactText = getImpactLevelText(event.impact);
      impactValue.textContent = `${event.name} - ${impactText}`;
      impactValue.style.color = '#ffd700';
    }
    
    // Add visual feedback based on impact level
    let glowColor = '#1D9BF0'; // Default blue
    if (impact >= 80) {
      glowColor = '#ffd700'; // Gold for high impact
    } else if (impact >= 60) {
      glowColor = '#ff9500'; // Orange for medium-high
    } else if (impact >= 40) {
      glowColor = '#1D9BF0'; // Blue for medium
    } else {
      glowColor = '#71767B'; // Gray for low
    }
    
    impactThumb.style.background = glowColor;
    impactThumb.style.boxShadow = `0 0 12px ${glowColor}80`;
    
    // Update fill gradient based on impact
    if (impact >= 70) {
      impactFill.style.background = `linear-gradient(90deg, #1D9BF0, #ffd700)`;
    } else if (impact >= 40) {
      impactFill.style.background = `linear-gradient(90deg, #1D9BF0, #ff9500)`;
    } else {
      impactFill.style.background = `linear-gradient(90deg, #71767B, #1D9BF0)`;
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
  // SCATTER PLOT - EXTRA LARGE & INTERACTIVE
  // ========================================
  const scatterContainer = document.getElementById('scatterChart');
  if (scatterContainer) {
    const margin = { top: 40, right: 80, bottom: 80, left: 80 };
    const containerWidth = Math.min(1100, window.innerWidth * 0.85);
    const width = containerWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#scatterChart')
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', 500)
      .attr('viewBox', `0 0 ${containerWidth} 500`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background', '#000000')
      .style('display', 'block')
      .style('margin', '0 auto')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([15, 65]).range([0, width]);
    const yScale = d3.scaleLinear().domain([25, 65]).range([height, 0]);

    // Enhanced grid with better spacing for zoomed view
    svg.append('g').selectAll('line.grid-line-x').data(xScale.ticks(10)).enter().append('line')
      .attr('class', 'grid-line').attr('x1', d => xScale(d)).attr('x2', d => xScale(d)).attr('y1', 0).attr('y2', height);
    svg.append('g').selectAll('line.grid-line-y').data(yScale.ticks(7)).enter().append('line')
      .attr('class', 'grid-line').attr('x1', 0).attr('x2', width).attr('y1', d => yScale(d)).attr('y2', d => yScale(d));

    // Reference lines with labels
    svg.append('line').attr('class', 'reference-line')
      .attr('x1', xScale(50)).attr('x2', xScale(50)).attr('y1', 0).attr('y2', height);
    svg.append('line').attr('class', 'reference-line')
      .attr('x1', 0).attr('x2', width).attr('y1', yScale(50)).attr('y2', yScale(50));

    svg.append('text').attr('x', xScale(50) + 8).attr('y', 20)
      .style('fill', '#1D9BF0').style('font-size', '18px').style('font-weight', '700')
      .text('Global');

    const tooltip = d3.select('body').append('div').attr('class', 'map-tooltip')
      .style('position', 'absolute').style('opacity', 0);

    const dataArray = Object.entries(sentimentData).map(([country, data]) => ({ country, ...data }));

    // Larger, more interactive dots
    const dots = svg.selectAll('.scatter-dot').data(dataArray).enter().append('circle')
      .attr('class', 'scatter-dot')
      .attr('cx', d => xScale(d.excited))
      .attr('cy', d => yScale(d.nervous))
      .attr('r', 0)
      .attr('fill', '#1D9BF0')
      .attr('opacity', 0.9)
      .attr('stroke', '#000000')
      .attr('stroke-width', 2);

    dots.transition().duration(1000).delay((d, i) => i * 40).attr('r', 10);

    dots.on('mouseover', function(event, d) {
        d3.select(this).transition().duration(150).attr('r', 15).attr('opacity', 1);
        
        // Show or highlight label for this country
        const existingLabel = svg.selectAll('.scatter-label')
          .filter(label => label.country === d.country);
        
        if (!existingLabel.empty()) {
          // Highlight existing label
          existingLabel
            .style('opacity', 1)
            .style('font-weight', '900')
            .style('font-size', '15px')
            .style('fill', '#1D9BF0');
        } else {
          // Create temporary label for unlabeled country
          svg.append('text')
            .attr('class', 'scatter-label-temp')
            .attr('x', xScale(d.excited) + 12)
            .attr('y', yScale(d.nervous) + 5)
            .attr('text-anchor', 'start')
            .text(d.country)
            .style('fill', '#1D9BF0')
            .style('font-size', '14px')
            .style('font-weight', '700')
            .style('pointer-events', 'none')
            .style('text-shadow', '2px 2px 4px rgba(0, 0, 0, 1), -2px -2px 4px rgba(0, 0, 0, 1), 2px -2px 4px rgba(0, 0, 0, 1), -2px 2px 4px rgba(0, 0, 0, 1), 0 0 6px rgba(0, 0, 0, 1)')
            .style('opacity', 0)
            .transition().duration(150).style('opacity', 1);
        }
        
        tooltip.html(`
          <div class="country-name">${d.country}</div>
          <div class="sentiment-values">
            <strong>Excited:</strong> ${d.excited.toFixed(1)}%<br/>
            <strong>Nervous:</strong> ${d.nervous.toFixed(1)}%<br/>
            <strong>Respondents:</strong> ${d.count.toLocaleString()}<br/>
            <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(29,155,240,0.3);">
              <em style="color:#71767B;">Sentiment: ${d.excited > d.nervous ? 'More Excited' : 'More Nervous'}</em>
            </div>
          </div>
        `)
          .classed('visible', true)
          .style('opacity', 1);

        // Clamp tooltip position so it remains within the viewport
        positionTooltip(tooltip, event.pageX, event.pageY, 15, 28);
      })
      .on('mousemove', function(event) {
        positionTooltip(tooltip, event.pageX, event.pageY, 15, 28);
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(150).attr('r', 10).attr('opacity', 0.9);
        
        // Reset permanent labels
        svg.selectAll('.scatter-label')
          .style('opacity', 1)
          .style('font-weight', '600')
          .style('font-size', '14px')
          .style('fill', '#E7E9EA');
        
        // Remove temporary labels
        svg.selectAll('.scatter-label-temp').remove();
        
        tooltip.style('opacity', 0).classed('visible', false);
      })
      .on('click', function(event, d) {
        // Pulse animation on click
        d3.select(this)
          .transition().duration(200).attr('r', 20)
          .transition().duration(200).attr('r', 10);
      });

    // Show all 21 countries from the dataset with labels
    const labeledCountries = new Set([
      'United States', 'United Kingdom', 'Australia', 'Canada', 
      'France', 'Germany', 'Spain', 'Italy', 'Poland', 'Portugal',
      'Japan', 'China', 'India', 'Indonesia', 'Pakistan',
      'Brazil', 'Argentina', 'Chile', 'Mexico', 
      'South Africa', 'Kenya'
    ]);
    
    svg.selectAll('.scatter-label')
      .data(dataArray.filter(d => labeledCountries.has(d.country)))
      .enter().append('text')
      .attr('class', 'scatter-label')
      .attr('x', d => {
        const x = xScale(d.excited);
        // Position labels based on data clustering
        if (d.country === 'India' || d.country === 'Indonesia') return x + 15;
        if (d.country === 'Australia' || d.country === 'United Kingdom' || d.country === 'Portugal') return x - 15;
        return x > width / 2 ? x + 15 : x - 15;
      })
      .attr('y', d => {
        const y = yScale(d.nervous);
        // Adjust vertical position for readability
        if (d.country === 'Indonesia') return y - 8;
        if (d.country === 'India') return y + 5;
        if (d.country === 'Kenya') return y - 8;
        return y + 5;
      })
      .attr('text-anchor', d => {
        if (d.country === 'India' || d.country === 'Indonesia') return 'start';
        if (d.country === 'Australia' || d.country === 'United Kingdom' || d.country === 'Portugal') return 'end';
        const x = xScale(d.excited);
        return x > width / 2 ? 'start' : 'end';
      })
      .text(d => d.country)
      .style('fill', '#E7E9EA')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .transition().duration(600).delay(1200).style('opacity', 1);

    // Enhanced axes
    svg.append('g').attr('class', 'scatter-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => d + '%').tickSize(10));
    
    svg.append('g').attr('class', 'scatter-axis')
      .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => d + '%').tickSize(10));

    // Axis labels
    svg.append('text').attr('x', width / 2).attr('y', height + 60)
      .style('text-anchor', 'middle').style('fill', '#E7E9EA')
      .style('font-size', '13px').style('font-weight', '700')
      .text('Excited about AI growth (%)');
    
    svg.append('text').attr('transform', 'rotate(-90)')
      .attr('x', -height / 2).attr('y', -55)
      .style('text-anchor', 'middle').style('fill', '#E7E9EA')
      .style('font-size', '13px').style('font-weight', '700')
      .text('Concerned about AI growth (%)');
  }

  // ========================================
  // WORLD MAP - EXTRA LARGE & INTERACTIVE
  // ========================================
  const mapContainer = document.getElementById('worldMap');
  if (!mapContainer) return;

  const mapWidth = Math.min(1100, window.innerWidth * 0.85);
  const mapHeight = 550;
  const mapSvg = d3.select('#worldMap').append('svg')
    .attr('width', mapWidth).attr('height', mapHeight)
    .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`)
    .style('background', '#000000');

  const mapTooltip = d3.select('body').append('div').attr('class', 'map-tooltip')
    .style('position', 'fixed').style('opacity', 0);

  const projection = d3.geoNaturalEarth1()
    .scale(mapWidth / 4.5)
    .translate([mapWidth / 2, mapHeight / 1.8]);

  const path = d3.geoPath().projection(projection);
  const colorScale = d3.scaleSequential()
    .domain([25, 60])
    .interpolator(d3.interpolateRgb('#4AADFF', '#FF4444'));

  // Map numeric 'nervous' values to human-friendly sentiment labels
  // (keep colors as-is; only redefine the meaning shown on hover)
  function getSentimentLabel(nervous) {
    if (nervous == null || isNaN(nervous)) return 'No data';
    // thresholds chosen to align with the visual blue->red continuum
    if (nervous <= 30) return 'Excited';
    if (nervous <= 45) return 'Balanced sentiment';
    if (nervous <= 55) return 'Slightly nervous';
    return 'Nervous';
  }

  // Add legend with even top/bottom internal padding
  const legendWidth = 220;
  const legendRightSpacing = 20; // spacing from right edge of SVG
  const internalPadding = 14; // equal top and bottom padding inside legend
  const titleFontSize = 16;
  const labelFontSize = 14;
  const barHeight = 15;

  // positions calculated so top and bottom padding are equal
  const titleY = internalPadding + titleFontSize; // baseline for title
  const barY = titleY + 8; // gap between title and bar
  const labelY = barY + barHeight + (labelFontSize + 4); // baseline for labels

  const legendHeight = labelY + internalPadding; // bottom padding equals top padding
  const legendX = mapWidth - legendWidth - legendRightSpacing;
  const legendY = mapHeight - legendHeight - 20; // keep a little extra spacing from SVG bottom

  const legend = mapSvg.append('g')
    .attr('class', 'map-legend')
    .attr('transform', `translate(${legendX}, ${legendY})`);

  legend.append('rect')
    .attr('width', legendWidth).attr('height', legendHeight)
    .attr('fill', 'rgba(22, 24, 28, 0.95)')
    .attr('stroke', 'rgba(29, 155, 240, 0.3)')
    .attr('stroke-width', 2)
    .attr('rx', 8);

  legend.append('text')
    .attr('x', 15).attr('y', titleY)
    .style('fill', '#E7E9EA').style('font-size', `${titleFontSize}px`).style('font-weight', '700')
    .text('Concern Level');

  const gradient = legend.append('defs').append('linearGradient')
    .attr('id', 'legend-gradient').attr('x1', '0%').attr('x2', '100%');
  gradient.append('stop').attr('offset', '0%').attr('stop-color', '#4AADFF');
  gradient.append('stop').attr('offset', '100%').attr('stop-color', '#FF4444');

  // gradient bar
  const barX = 15;
  const barWidth = legendWidth - barX * 2;
  legend.append('rect')
    .attr('x', barX).attr('y', barY).attr('width', barWidth).attr('height', barHeight)
    .attr('fill', 'url(#legend-gradient)').attr('rx', 3);

  // labels
  legend.append('text').attr('x', barX).attr('y', labelY)
    .style('fill', '#71767B').style('font-size', `${labelFontSize}px`).text('Excited');
  legend.append('text').attr('x', barX + barWidth).attr('y', labelY)
    .style('fill', '#71767B').style('font-size', `${labelFontSize}px`).attr('text-anchor', 'end').text('Nervous');

  try {
    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const countries = topojson.feature(world, world.objects.countries);

    mapSvg.selectAll('.country').data(countries.features).enter().append('path')
      .attr('class', d => sentimentData[normalizeCountryName(d.properties.name)] ? 'country has-data' : 'country')
      .attr('d', path)
      .attr('fill', d => {
        const data = sentimentData[normalizeCountryName(d.properties.name)];
        return data ? colorScale(data.nervous) : '#1a1a1a';
      })
      .style('opacity', 0)
      .transition().duration(1000).delay((d, i) => i * 2).style('opacity', 1)
      .selection()
      .on('mouseover', function(event, d) {
        const data = sentimentData[normalizeCountryName(d.properties.name)];
        if (data) {
          d3.select(this).transition().duration(200).style('opacity', 1);
          
          mapTooltip.html(`
            <div class="country-name">${d.properties.name}</div>
            <div class="sentiment-values">
              <strong>Nervous:</strong> ${data.nervous.toFixed(1)}%<br/>
              <strong>Excited:</strong> ${data.excited.toFixed(1)}%<br/>
              <strong>Respondents:</strong> ${data.count.toLocaleString()}<br/>
              <div style="margin-top:10px; padding-top:8px; border-top:2px solid rgba(29,155,240,0.3);">
                <div style="background:${colorScale(data.nervous)}; height:8px; border-radius:4px; margin-top:4px;"></div>
                <em style="color:#71767B; font-size:13px;">
                  ${getSentimentLabel(data.nervous)}
                </em>
              </div>
            </div>
          `)
            .classed('visible', true)
            .style('opacity', 1);

          // Position/map tooltip and clamp to viewport
          positionTooltip(mapTooltip, event.pageX, event.pageY, 15, 28);
        }
      })
      .on('mousemove', function(event) {
        positionTooltip(mapTooltip, event.pageX, event.pageY, 15, 28);
      })
      .on('mouseout', function() {
        const data = sentimentData[normalizeCountryName(d3.select(this).datum().properties.name)];
        if (data) {
          d3.select(this).transition().duration(200).style('opacity', 0.9);
        }
  mapTooltip.style('opacity', 0).classed('visible', false);
      })
      .on('click', function(event, d) {
        const data = sentimentData[normalizeCountryName(d.properties.name)];
        if (data) {
          // Pulse animation
          d3.select(this)
            .transition().duration(150).style('opacity', 1).attr('stroke-width', 4)
            .transition().duration(150).attr('stroke-width', 1.2);
        }
      });

  } catch (error) {
    console.error('Error loading map data:', error);
    mapContainer.innerHTML = '<p style="color: #E7E9EA; text-align: center; padding: 2rem; font-size:18px;">Map visualization could not be loaded. Please check your internet connection.</p>';
  }
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
// CLICKABLE CARDS FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Find all clickable cards in the conclusion section
  const clickableCards = document.querySelectorAll('.clickable-card');
  
  clickableCards.forEach(card => {
    const expandedContent = card.querySelector('.card-expanded-content');
    const cardHint = card.querySelector('.card-hint');
    
    if (expandedContent) {
      // Initially hide expanded content
      expandedContent.style.display = 'none';
      expandedContent.style.maxHeight = '0';
      expandedContent.style.opacity = '0';
      expandedContent.style.overflow = 'hidden';
      expandedContent.style.transition = 'all 0.3s ease-in-out';
      
      let isExpanded = false;
      
      // Add click event listener
      card.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!isExpanded) {
          // Expand the card
          expandedContent.style.display = 'block';
          expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
          expandedContent.style.opacity = '1';
          expandedContent.style.marginTop = '1rem';
          
          // Update hint text
          if (cardHint) {
            cardHint.textContent = 'Click to collapse';
          }
          
          // Add expanded class for additional styling
          card.classList.add('expanded');
          
        } else {
          // Collapse the card
          expandedContent.style.maxHeight = '0';
          expandedContent.style.opacity = '0';
          expandedContent.style.marginTop = '0';
          
          // Update hint text
          if (cardHint) {
            const isDetailsCard = card.querySelector('.answer-verdict');
            cardHint.textContent = isDetailsCard ? 'Click for details' : 'Click for tips';
          }
          
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
      });
      
      card.addEventListener('mouseleave', function() {
        if (!card.classList.contains('expanded')) {
          card.style.transform = 'translateY(0)';
        }
      });
    }
  });
  
  // Also handle the message content card (The Takeaway)
  const messageContent = document.querySelector('.conclusion-message');
  if (messageContent && !messageContent.classList.contains('clickable-card')) {
    messageContent.classList.add('clickable-card');
    
    const expandedContent = messageContent.querySelector('.card-expanded-content');
    const cardHint = messageContent.querySelector('.card-hint');
    
    if (expandedContent) {
      // Initially hide expanded content
      expandedContent.style.display = 'none';
      expandedContent.style.maxHeight = '0';
      expandedContent.style.opacity = '0';
      expandedContent.style.overflow = 'hidden';
      expandedContent.style.transition = 'all 0.3s ease-in-out';
      
      let isExpanded = false;
      
      // Add click event listener
      messageContent.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!isExpanded) {
          // Expand the card
          expandedContent.style.display = 'block';
          expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
          expandedContent.style.opacity = '1';
          expandedContent.style.marginTop = '1rem';
          
          // Update hint text
          if (cardHint) {
            cardHint.textContent = 'Click to collapse';
          }
          
          // Add expanded class for additional styling
          messageContent.classList.add('expanded');
          
        } else {
          // Collapse the card
          expandedContent.style.maxHeight = '0';
          expandedContent.style.opacity = '0';
          expandedContent.style.marginTop = '0';
          
          // Update hint text
          if (cardHint) {
            cardHint.textContent = 'Click for tips';
          }
          
          // Remove expanded class
          messageContent.classList.remove('expanded');
          
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
      messageContent.addEventListener('mouseenter', function() {
        messageContent.style.transform = 'translateY(-2px)';
        messageContent.style.cursor = 'pointer';
      });
      
      messageContent.addEventListener('mouseleave', function() {
        if (!messageContent.classList.contains('expanded')) {
          messageContent.style.transform = 'translateY(0)';
        }
      });
    }
  }
});