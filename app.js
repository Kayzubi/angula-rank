import {get, getAllContributors, getUser} from './src/github.js' 



let repos = [];
let contributors = [];
let contributorsWithDup = [];





    async function getData() {
    
    
        get('https://api.github.com/users/angular/repos')
        .then(async res => {
    
        
    
            for ( const repo of res ) {
                // Get contributors for each repo, then push selected repo information into repos array
    
    
                const repoContributors = repo.contributors_url ? await getAllContributors(repo.contributors_url) : null;
    
                repos.push({fullname : repo.full_name, description:repo.description, stargazers : repo.stargazers_count, watchers: repo.watchers_count, created_at : repo.created_at, updated_at: repo.updated_at, contributors: repoContributors})
    
                //push all contributors to contributors(with duplicates array)
                repoContributors.forEach(contributor => {
                    contributorsWithDup.push({id:contributor.id, login: contributor.login, contributions: contributor.contributions, avatar_url: contributor.avatar_url, url: contributor.url})
                })  
            }
        })
        .then(()=> {
    
            // build up contributors array with only unique contributors
            for (const e of contributorsWithDup) {
    
                //check if contributor is already present
                let found = contributors.find(el => el.id === e.id);
    
                if(!found) {
                    contributors.push(e);
                }else {
                    found.contributions = found.contributions + e.contributions;
                }
            }    
        })
        .then(() => {
            // get aditional information of unique contributors

            for (const contributor of contributors) {

                getUser(contributor.url)
                    .then( res => {
                        contributor.bio = res.bio;
                        contributor.location = res.location;
                        contributor.followers = res.followers;
                        contributor.following = res.following;
                        contributor.email = res.email;
                        contributor.pubic_repos = res.public_repos;
                        contributor.public_gists = res.public_gists;
                        contributor.company = res.company;
                        contributor.name = res.name;
                        contributor.html_url = res.html_url
                    })
            }

            console.log(contributors)
        })
    
       
    }




getData();

