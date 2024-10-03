// Hard-coded Players and Votes
const players = {
  "player1": { password: "password1", hasVoted: false },
  "player2": { password: "password2", hasVoted: false },
  "player3": { password: "password3", hasVoted: false },
  "player4": { password: "password4", hasVoted: false }
};

// Global vote count object (acts like "shared storage" in this session)
const voteCounts = {
  striker: {},
  midfielder: {},
  keeper: {},
  worst: {}
};

// Initialize all players in the voteCounts object
Object.keys(players).forEach(player => {
  voteCounts.striker[player] = 0;
  voteCounts.midfielder[player] = 0;
  voteCounts.keeper[player] = 0;
  voteCounts.worst[player] = 0;
});

let currentPlayer = null; // Store the currently logged-in player

// Login Functionality
function loginPlayer() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // Check if username exists and the password matches
  if (players[username] && players[username].password === password) {
      if (players[username].hasVoted) {
          document.getElementById('login-message').innerText = "You've already voted!";
          return;
      }
      currentPlayer = username;
      document.getElementById('login-message').innerText = "Login successful!";
      document.getElementById('voting-section').style.display = "block";
      populateVotingOptions();
      showStats(); // Show current stats upon login
  } else {
      document.getElementById('login-message').innerText = "Invalid username or password!";
  }
}

// Populate Voting Options from the list of Players
function populateVotingOptions() {
  const playersList = Object.keys(players);
  const strikerSelect = document.getElementById('vote-striker');
  const midfielderSelect = document.getElementById('vote-midfielder');
  const keeperSelect = document.getElementById('vote-keeper');
  const worstSelect = document.getElementById('vote-worst');

  // Clear existing options
  strikerSelect.innerHTML = "";
  midfielderSelect.innerHTML = "";
  keeperSelect.innerHTML = "";
  worstSelect.innerHTML = "";

  // Populate dropdown with player names, but exclude the logged-in player
  playersList.forEach(player => {
      if (player !== currentPlayer) {
          strikerSelect.innerHTML += `<option value="${player}">${player}</option>`;
          midfielderSelect.innerHTML += `<option value="${player}">${player}</option>`;
          keeperSelect.innerHTML += `<option value="${player}">${player}</option>`;
          worstSelect.innerHTML += `<option value="${player}">${player}</option>`;
      }
  });
}

// Submit Vote Function
function submitVote() {
  if (!currentPlayer) {
      document.getElementById('vote-message').innerText = "Please log in to vote.";
      return;
  }

  if (players[currentPlayer].hasVoted) {
      document.getElementById('vote-message').innerText = "You've already voted!";
      return;
  }

  const striker = document.getElementById('vote-striker').value;
  const midfielder = document.getElementById('vote-midfielder').value;
  const keeper = document.getElementById('vote-keeper').value;
  const worst = document.getElementById('vote-worst').value;

  // Ensure a player doesn't vote for themselves
  if ([striker, midfielder, keeper, worst].includes(currentPlayer)) {
      document.getElementById('vote-message').innerText = "You cannot vote for yourself!";
      return;
  }

  // Increment the vote count for each selected player
  voteCounts.striker[striker] += 1;
  voteCounts.midfielder[midfielder] += 1;
  voteCounts.keeper[keeper] += 1;
  voteCounts.worst[worst] += 1;

  // Mark the player as having voted
  players[currentPlayer].hasVoted = true;

  document.getElementById('vote-message').innerText = "Vote submitted successfully!";
  
  // Update and show the stats
  showStats();
}

// Display the stats of how many votes each player has received
function showStats() {
  const statsSection = document.getElementById('stats-section');
  statsSection.innerHTML = "<h3>Voting Stats:</h3>";

  Object.keys(players).forEach(player => {
      const strikerVotes = voteCounts.striker[player];
      const midfielderVotes = voteCounts.midfielder[player];
      const keeperVotes = voteCounts.keeper[player];
      const worstVotes = voteCounts.worst[player];

      statsSection.innerHTML += `
          <div>
              <strong>${player}</strong> - Striker: ${strikerVotes}, Midfielder: ${midfielderVotes}, Keeper: ${keeperVotes}, Worst: ${worstVotes}
          </div>
      `;
  });
}
