document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = searchInput.value;
        searchGitHubUser(username);
    });

    async function searchGitHubUser(username) {
        const userSearchUrl = `https://api.github.com/search/users?q=${username}`;

        try {
            const response = await fetch(userSearchUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                displayUserResults(data.items);
            } else {
                resultsDiv.innerHTML = 'Error searching for users.';
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = 'An error occurred while fetching data.';
        }
    }

    function displayUserResults(users) {
        resultsDiv.innerHTML = '';

        users.forEach((user) => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            const avatar = document.createElement('img');
            avatar.src = user.avatar_url;
            avatar.alt = `${user.login}'s avatar`;

            const username = document.createElement('p');
            username.textContent = user.login;

            const profileLink = document.createElement('a');
            profileLink.href = user.html_url;
            profileLink.textContent = 'View Profile';

            userCard.appendChild(avatar);
            userCard.appendChild(username);
            userCard.appendChild(profileLink);

            userCard.addEventListener('click', () => {
                getUserRepositories(user.login);
            });

            resultsDiv.appendChild(userCard);
        });
    }

    async function getUserRepositories(username) {
        const userReposUrl = `https://api.github.com/users/${username}/repos`;

        try {
            const response = await fetch(userReposUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const repos = await response.json();
                displayUserRepositories(username, repos);
            } else {
                resultsDiv.innerHTML = 'Error fetching user repositories.';
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = 'An error occurred while fetching repositories.';
        }
    }

    function displayUserRepositories(username, repositories) {
        resultsDiv.innerHTML = '';
        const repoList = document.createElement('ul');

        repositories.forEach((repo) => {
            const repoItem = document.createElement('li');
            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.textContent = repo.name;
            repoItem.appendChild(repoLink);
            repoList.appendChild(repoItem);
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Search';
        backButton.addEventListener('click', () => {
            searchGitHubUser(username);
        });

        resultsDiv.appendChild(backButton);
        resultsDiv.appendChild(repoList);
    }
});
