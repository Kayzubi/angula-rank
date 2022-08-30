

// load event listeners
function loadEventListeners(){
    const userLink = document.querySelectorAll('.contributor-link')
    const repoLink = document.querySelectorAll('.repo-link')
    const buttons = document.querySelectorAll('.page')

    // Navbar links events
    uiSelectors.contributorTableLink.addEventListener('click', e => {
        app.change(new homeState)
        uiSelectors.contributorTableLink.classList.add('active')
        uiSelectors.repoTableLink.classList.remove('active')
        e.preventDefault();
    });
    uiSelectors.repoTableLink.addEventListener('click', e => {
        state.page = 1;
        app.change(new reposTable)
        uiSelectors.contributorTableLink.classList.remove('active');
        uiSelectors.repoTableLink.classList.add('active');

        e.preventDefault();
    })

    // close user or repo display
    uiSelectors.backButton.addEventListener('click', e => {
        if (uiSelectors.repoDetails.classList.contains('hidden')){
            uiSelectors.homepage.classList.remove('hidden')
            uiSelectors.userDetails.classList.add('hidden')
            uiSelectors.backButton.classList.add('hidden')
        } else {
            uiSelectors.homepage.classList.remove('hidden')
            uiSelectors.repoDetails.classList.add('hidden')
            uiSelectors.backButton.classList.add('hidden')
        }


        e.preventDefault();
    })


    // sort contributor event
    uiSelectors.sortOption.addEventListener('change', e => {
        let value = uiSelectors.sortOption.options[uiSelectors.sortOption.selectedIndex].value;

        if (value === 'contributions'){
            uniqueContributors.sort((a, b)=> {
                return b.contributions - a.contributions
            })
            homeState();
        } else if (value === 'followers') {
            uniqueContributors.sort((a, b)=> {
                return b.followers - a.followers
            })
            homeState();
        } else if (value === 'public_repos') {
            uniqueContributors.sort((a, b)=> {
                return b.public_repos - a.public_repos
            })
            homeState();
        } else if (value === 'public_gists') {
            uniqueContributors.sort((a, b)=> {
                return b.public_gists - a.public_gists
            })
            homeState();
        }
    })


    // contributor link events
    for(const link of userLink){
        link.addEventListener('click', e => {
            let userID = e.target.parentElement.id

            
            app.change(new userState(userID));
        })
    }

    // Repolink events
    for(const link of repoLink){
        link.addEventListener('click', e => {
            let repoName = e.target.parentElement.id;

            console.log(repoName);
            app.change(new repoState(repoName));
        })
    }

    // page buttons event
    for (const button of buttons) {
        button.addEventListener('click', (e)=> {
            let parent = document.getElementById('body');
            parent.innerHTML ='';

            state.page = Number(e.target.value);
            
            if (parent.classList.contains('contri-table')){
                homeState();
            } else if (parent.classList.contains('repo-table')){
                reposTable();
            }
        })
    }
    
}

// fetch data from github
async function getData() {

    return  get('https://api.github.com/users/angular/repos')
            .then(async res => {
            for ( const repo of res ) {
                // Get contributors for each repo, then push selected repo information into repos array
                const repoContributors = repo.contributors_url ? await get(repo.contributors_url) : null;
    
                repos.push({fullname : repo.full_name, description:repo.description??"Not Available", stargazers : repo.stargazers_count, watchers: repo.watchers_count, created_at : repo.created_at, updated_at: repo.updated_at, contributors: repoContributors})
    
                // Build up contributors array
                repoContributors.forEach(contributor => {

                    // check if contributor is already present in contributors array
                    let found = uniqueContributors.find(el => el.login === contributor.login);

                        if(found) {
                            // add contributions
                             found['contributions']+= contributor['contributions'];
                        } else {

                            // get additional details of contributor and push to contributors array
                            getUser(contributor.url)
                            .then(res=> {
                                uniqueContributors.push({id:contributor.id, login: contributor.login, contributions: contributor.contributions, avatar_url: contributor.avatar_url, url: contributor.url, bio:res.bio??'Not available', followers:res.followers, following:res.following, public_gists:res.public_gists, public_repos:res.public_repos, email:res.email??'Not available', name:res.name??'Not available', company: res.company??'Not available', location:res.location??'Not available'})
                            })

                        }
                })  
            }
             document.getElementById('homeTable').classList.remove('hidden');
             document.querySelector('.spinner-grow').classList.add('hidden')
            })
       
    }


   