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
    const chartDiv = document.getElementById('chart-ignored');
    if (!chartDiv) {
      console.error('#chart-ignored element not found');
      return;
    }

    const svg = d3.select("#chart-ignored")
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

    // Store the user prediction for the next section
    window.userBotPrediction = userPrediction;

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
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Update user prediction
        if (window.userBotPrediction) {
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
    revealViz.selectAll("*").remove();
    
    const width = 1000;
    const height = 500;
    const circleRadius = 18;
    const spacing = 90;
    const gridSize = 10;

    const svg = revealViz
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("max-width", "100%")
      .style("height", "auto");

    const startX = (width - (gridSize * spacing)) / 2 + spacing / 2;
    const startY = (height - (gridSize * spacing)) / 2 + spacing / 2;

    // Create array of 100 items: 3 bots, 97 humans
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: i,
        isBot: i < 3 // First 3 are bots
      });
    }

    // Verify before shuffle
    const botsBeforeShuffle = data.filter(d => d.isBot).length;
    console.log('Before shuffle - Bots:', botsBeforeShuffle, 'Humans:', 100 - botsBeforeShuffle);

    // Shuffle the array
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    // Verify after shuffle
    const botsAfterShuffle = data.filter(d => d.isBot).length;
    console.log('After shuffle - Bots:', botsAfterShuffle, 'Humans:', 100 - botsAfterShuffle);

    // Assign grid positions
    data.forEach((d, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      d.x = startX + col * spacing;
      d.y = startY + row * spacing;
    });

    console.log('Total items:', data.length);
    console.log('Bots:', data.filter(d => d.isBot).length);
    console.log('Humans:', data.filter(d => !d.isBot).length);

    // Create circles
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 0)
      .attr("fill", d => d.isBot ? "#E91E8C" : "#1D9BF0")
      .attr("stroke", d => d.isBot ? "#FF1744" : "#0084D4")
      .attr("stroke-width", d => d.isBot ? 4 : 2)
      .classed('bot-circle', d => d.isBot)
      .attr("opacity", 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 10)
      .attr("r", circleRadius)
      .attr("opacity", 0.9);

    // Create icons
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "16px")
      .attr("opacity", 0)
      .text(d => d.isBot ? "🤖" : "👤")
      .transition()
      .duration(500)
      .delay((d, i) => i * 10 + 400)
      .attr("opacity", 1);

    // Pulse bot circles
    setTimeout(() => {
      svg.selectAll("circle")
        .filter(d => d.isBot)
        .transition()
        .duration(500)
        .attr("r", circleRadius + 6)
        .transition()
        .duration(400)
        .attr("r", circleRadius)
        .transition()
        .duration(500)
        .attr("r", circleRadius + 6)
        .transition()
        .duration(400)
        .attr("r", circleRadius);
    }, 2000);

    // If the user already submitted a prediction, highlight that many bot-circles visually
    const userPred = window.userBotPrediction || 0;
    if (userPred > 0) {
      // highlight the first `userPred` bot circles by adding a class and a glow
      const botNodes = svg.selectAll('circle').filter(d => d.isBot).nodes();
      for (let i = 0; i < botNodes.length && i < userPred; i++) {
        d3.select(botNodes[i]).classed('user-highlight', true)
          .attr('stroke-width', 6)
          .attr('opacity', 1);
      }
    }
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

  const margin = { top: 60, right: 40, bottom: 80, left: 80 };
  const width = 1200 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

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
    .attr("font-size", "11px")
    .attr("fill", "#fff")
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
    .style("font-size", "11px");

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
    .style("font-size", "14px")
    .style("fill", "#8899A6")
    .text("Number of removed fake accounts (in millions)");

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

  const margin = { top: 60, right: 150, bottom: 80, left: 80 };
  const width = 1400 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = trafficDiv
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .style("font-weight", "bold")
    .style("fill", "#fff")
    .text("GLOBAL INTERNET TRAFFIC FOR THE PAST 10 YEARS");

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

  // Colors matching the image
  const colors = {
    human: "#00D4FF",      // Cyan/turquoise
    goodBot: "#E91E8C",    // Magenta/pink
    badBot: "#00C896"      // Teal/green
  };

  // Area generator
  const area = d3.area()
    .x(d => x(d.data.year))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveMonotoneX);

  // Draw areas
  svg.selectAll(".area")
    .data(series)
    .join("path")
    .attr("class", "area")
    .attr("d", area)
    .style("fill", d => colors[d.key])
    .style("opacity", 0.9);

  // Add percentage labels on the areas
  series.forEach((serie, i) => {
    data.forEach((d, j) => {
      const value = serie[j][1] - serie[j][0];
      const xPos = x(d.year);
      const yPos = y(serie[j][0] + value / 2);
      
      svg.append("text")
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "#fff")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .text(`${value}%`);
    });
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

  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width + 30}, ${height / 2 - 60})`);

  const legendData = [
    { key: "human", label: "Human", color: colors.human },
    { key: "badBot", label: "Bad Bot", color: colors.badBot },
    { key: "goodBot", label: "Good Bot", color: colors.goodBot }
  ];

  legendData.forEach((item, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 35})`);

    legendRow.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 10)
      .style("fill", item.color);

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
document.addEventListener('DOMContentLoaded', async () => {
  const chartDiv = d3.select("#chart-ignored");
  const tooltip = d3.select(".tooltip");

  if (chartDiv.empty()) {
    console.warn('No #chart-ignored element found; skipping chart');
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
  const chartContainer = document.getElementById('searchTrendChart');
  
  if (!chartContainer) return;
  
  let currentData = [];
  let svg, xScale, yScale, line, area, path, dots, peakCircle, peakLabel;
  
  // Load the CSV data using d3.text to handle custom format
  // We'll show an in-page notice if the CSV is missing or can't be parsed.
  let sampleData = createSampleData();

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

  d3.text('search_traffic_google.csv').then(text => {
    try {
      // Split into lines and skip the first line (category header)
      const lines = text.split('\n').slice(2); // Skip first 2 lines

      // Parse the data
      const allData = lines
        .map(line => {
          const [dateStr, valueStr] = line.split(',');
          if (!dateStr || !valueStr) return null;

          const date = d3.timeParse('%Y-%m-%d')(dateStr.trim());
          const value = +valueStr.trim();

          return { date, value };
        })
        .filter(d => d && d.date && !isNaN(d.value));

      if (allData.length === 0) {
        showNotice();
        return;
      }

      currentData = allData;

      // Update stats
      updateStats(allData);

      // Initial render
      renderChart(allData);

      // Setup interactive controls
      setupControls(allData);
    } catch (e) {
      console.error('Error parsing search trend data:', e);
      showNotice();
    }

  }).catch(error => {
    console.warn('Search trend CSV not available locally:', error);
    // Show the in-page notice rather than silently using sample data
    showNotice();
  });
  
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
    
    document.getElementById('avgRecent').textContent = avgRecent;
    document.getElementById('consistentMonths').textContent = consistentMonths;
    document.getElementById('growthRate').textContent = growth === 'Infinity' ? '∞' : `+${growth}%`;
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
    // Clear previous chart
    d3.select('#searchTrendChart').selectAll('*').remove();
    
    // Set up dimensions - MASSIVE, INTERACTIVE CHART
    const margin = { top: 80, right: 100, bottom: 120, left: 120 };
    const width = Math.min(1800, window.innerWidth * 0.95) - margin.left - margin.right;
    const height = 750 - margin.top - margin.bottom;
    
    // Create SVG
    svg = d3.select('#searchTrendChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
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
    
    // Add axes with larger, more readable text
    const xAxis = d3.axisBottom(xScale)
      .ticks(14)
      .tickFormat(d3.timeFormat('%b \'%y'))
      .tickSize(10)
      .tickPadding(12);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(12)
      .tickSize(10)
      .tickPadding(12);
    
    svg.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
    
    svg.append('g')
      .attr('class', 'chart-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '18px')
      .style('font-weight', '600');
    
    // Add axis labels with large, bold sans-serif text
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 100)
      .style('text-anchor', 'middle')
      .style('fill', '#E7E9EA')
      .style('font-size', '24px')
      .style('font-weight', '700')
      .style('letter-spacing', '1.5px')
      .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif')
      .text('Time Period');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -85)
      .style('text-anchor', 'middle')
      .style('fill', '#E7E9EA')
      .style('font-size', '24px')
      .style('font-weight', '700')
      .style('letter-spacing', '1.5px')
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
      .attr('r', 9)
      .style('opacity', 1);
    
    // Re-select dots for interactivity
    svg.selectAll('.chart-dot')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', 11);
        
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
          .attr('r', 9);
        
        tooltip.classed('visible', false);
      })
      .on('click', function(event, d) {
        // Add click effect
        const circle = d3.select(this);
        circle
          .transition()
          .duration(300)
          .attr('r', 18)
          .transition()
          .duration(300)
          .attr('r', 9);
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
    const margin = { top: 50, right: 150, bottom: 100, left: 100 };
    const width = Math.min(1600, window.innerWidth * 0.95) - margin.left - margin.right;
    const height = 750 - margin.top - margin.bottom;

    const svg = d3.select('#scatterChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', '#000000')
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
            .style('font-size', '16px')
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
            .style('font-size', '15px')
            .style('font-weight', '700')
            .style('pointer-events', 'none')
            .style('text-shadow', '1px 1px 3px rgba(0, 0, 0, 0.9), -1px -1px 3px rgba(0, 0, 0, 0.9), 1px -1px 3px rgba(0, 0, 0, 0.9), -1px 1px 3px rgba(0, 0, 0, 0.9)')
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
          .style('font-size', '15px')
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
      .style('font-size', '15px')
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
    svg.append('text').attr('x', width / 2).attr('y', height + 70)
      .style('text-anchor', 'middle').style('fill', '#E7E9EA')
      .style('font-size', '18px').style('font-weight', '700')
      .text('Excited about AI growth (%)');
    
    svg.append('text').attr('transform', 'rotate(-90)')
      .attr('x', -height / 2).attr('y', -65)
      .style('text-anchor', 'middle').style('fill', '#E7E9EA')
      .style('font-size', '18px').style('font-weight', '700')
      .text('Concerned about AI growth (%)');
  }

  // ========================================
  // WORLD MAP - EXTRA LARGE & INTERACTIVE
  // ========================================
  const mapContainer = document.getElementById('worldMap');
  if (!mapContainer) return;

  const mapWidth = Math.min(1600, window.innerWidth * 0.95);
  const mapHeight = 750;
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