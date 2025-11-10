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



