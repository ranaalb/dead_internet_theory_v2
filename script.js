// Select dots and sections
const dots = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('.section');
const container = document.querySelector('.container');

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
  scoreEl.textContent = score;
  totalEl.textContent = gameData.length;
  currentEl.textContent = currentQuestion + 1;
  totalQuestionsEl.textContent = gameData.length;
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
  const correct = gameData[currentQuestion].isBot === isBot;
  
  if (correct) {
    score++;
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
    message = '🎉 Excellent! You have great digital literacy skills!';
  } else if (percentage >= 60) {
    message = '👍 Good job! You can spot most fake content.';
  } else if (percentage >= 40) {
    message = '🤔 Not bad, but there\'s room for improvement in detecting AI content.';
  } else {
    message = '📚 Keep practicing! AI detection is tricky but learnable.';
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
    root: container,
    threshold: 0.5
  }
);

const section6 = document.getElementById('section6');
if (section6) {
  gameObserver.observe(section6);
}


});

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

// ========== IGNORED POSTS CHART (BOTS VS HUMANS) ==========
document.addEventListener('DOMContentLoaded', async () => {
  const chartDiv = d3.select("#chart-ignored");
    const tooltip = d3.select(".tooltip");

    const width = 700, height = 450, margin = { top: 40, right: 20, bottom: 60, left: 60 };

    if (chartDiv.empty()) {
      console.warn('No #chart-ignored element found; skipping ignored-posts chart');
      return;
    }

    const svg = chartDiv.append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const DATASET_PATH = 'Truth_Seeker_sample.csv'; // use sample for testing
    let data = [];
    try {
      data = await d3.csv(DATASET_PATH);
    } catch (err) {
      console.error('Failed to load CSV for ignored-posts chart:', err);
      chartDiv.append('text')
        .attr('x', 20)
        .attr('y', 40)
        .attr('fill', 'white')
        .text('Could not load dataset for this chart.');
      return;
    }

    // Ensure numeric conversion
    data.forEach(d => {
      d.likes = +d.likes || 0;
      d.retweets = +d.retweets || 0;
      d.replies = +d.replies || 0;
    });

    const cols = data.columns || (data.length ? Object.keys(data[0]) : []);

    // Candidate column names for account type
    const candidates = ['account_type','accountType','AccountType','account_type_label','BotScoreBinary','bot','is_bot','bot_label','label'];
    let groupKey = cols.find(c => candidates.map(x=>x.toLowerCase()).includes(c.toLowerCase()));

    // If still not found, try to detect a binary column with only 0/1 values
    if (!groupKey) {
      for (const c of cols) {
        const vals = new Set(data.map(d => (d[c]||'').toString().trim()).filter(x=>x!==""));
        if (vals.size > 0 && vals.size <= 2) {
          // likely a binary/grouping column
          groupKey = c;
          break;
        }
      }
    }

    // Normalizer to map various labels to 'Human' or 'Bot'
    const normalize = v => {
      if (v == null) return 'Unknown';
      const s = String(v).trim();
      if (s === '' ) return 'Unknown';
      if (s === '0' || /^human$/i.test(s) || /human/i.test(s)) return 'Human';
      if (s === '1' || /^bot$/i.test(s) || /bot/i.test(s)) return 'Bot';
      return s;
    };

    // Build summary counts (percentage ignored) grouped by normalized type
    const grouped = d3.rollups(
      data,
      v => {
        const ignored = v.filter(d => (d.likes + d.retweets + d.replies) === 0).length;
        return (ignored / v.length) * 100;
      },
      d => groupKey ? normalize(d[groupKey]) : 'Unknown'
    );

    // Convert to object map
    const map = new Map(grouped.map(([k,v]) => [k, v]));

    // Ensure both Human and Bot entries exist (default 0)
    const dataset = [
      { type: 'Human', ignoredPct: +(map.get('Human') || 0) },
      { type: 'Bot', ignoredPct: +(map.get('Bot') || 0) }
    ];

    const x = d3.scaleBand()
      .domain(dataset.map(d => d.type))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d => d + "%"));

    // Bars with animation
    g.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.type))
      .attr("width", x.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", d => d.type === "Bot" ? "#ec1010ff" : "#286cd8ff")
      .transition()
      .duration(1200)
      .attr("y", d => y(d.ignoredPct))
      .attr("height", d => innerHeight - y(d.ignoredPct));

    // Add hover interaction
    g.selectAll(".bar")
      .on("mousemove", (event, d) => {
        tooltip.style("opacity", 1)
          .html(`<strong>${d.type}</strong><br>${d.ignoredPct.toFixed(1)}% ignored posts`)
          .style("left", (event.clientX + 10) + "px")
          .style("top", (event.clientY - 40) + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Labels
    g.selectAll(".label")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.type) + x.bandwidth() / 2)
      .attr("y", d => y(d.ignoredPct) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => d.ignoredPct.toFixed(1) + "%");

    // Titles
    g.append("text")
      .attr("class", "chart-title")
      .attr("x", innerWidth / 2)
      .attr("y", -10)
      .text("% of Posts with No Engagement");
  });



