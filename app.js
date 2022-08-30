import {get, getAllContributors, getUser} from './src/github.js' 
import { pagination, pageButtons} from "../pagination.js";



let repos = [];
let uniqueContributors = [];
let state = {
    page: 1,
    rows: 10,
    window: 5
} 
let uiSelectors = {
    homepage : document.getElementById('homepage'),
    userDetails : document.getElementById('user-details'),
    repoDetails: document.getElementById('repo-details'),
    sort: document.querySelector('.sortContributors'),
    sortOption: document.getElementById('sort'),
    contributorTableLink: document.getElementById('contributors-table__link'),
    repoTableLink: document.getElementById('repos-table__link'),
    backButton: document.querySelector('.back-button')
}

// Home State
export const homeState = function() {
    uiSelectors.homepage.classList.remove('hidden')
    uiSelectors.userDetails.classList.add('hidden');
    uiSelectors.repoDetails.classList.add('hidden');
    uiSelectors.backButton.classList.add('hidden');
    uiSelectors.sort.classList.remove('hidden')
    uiSelectors.contributorTableLink.classList.add('active');
    uiSelectors.repoTableLink.classList.remove('active');

    const tableHead = document.getElementById('head');
    tableHead.innerHTML = ` 
        <tr>
            <th scope= "col"></th>
            <th scope= "col">Username</th>
            <th scope= "col">Contributions</th>
            <th scope= "col">Followers</th>
            <th scope= "col">Public Repos</th>
            <th scope= "col">Public gists</th>
        </tr>
    `;

    const tableBody = document.getElementById('body');
    tableBody.className = 'contri-table';
    tableBody.innerHTML ='';

    let data = pagination(uniqueContributors, state.page, state.rows);


    data.trimmedData.forEach(contributor => {
        let tableItem = document.createElement('tr')
        tableItem.classList = 'contributor-link';
        tableItem.id = `${contributor.id}`
    
        tableItem.innerHTML = `
            <td><img class="tableimg" src ="${contributor.avatar_url}"></td>
            <td>${contributor.login}</td>
            <td>${contributor.contributions}</td>
            <td>${contributor.followers}</td>
            <td>${contributor.public_repos}</td>
            <td>${contributor.public_gists}</td>
        `
        tableBody.appendChild(tableItem);
    })

    pageButtons(data.pages, state)
    loadEventListeners();
}

// Display Repos Table
const reposTable = function(){
    uiSelectors.homepage.classList.remove('hidden')
    uiSelectors.userDetails.classList.add('hidden');
    uiSelectors.repoDetails.classList.add('hidden');
    uiSelectors.backButton.classList.add('hidden');
    uiSelectors.sort.classList.add('hidden');
    uiSelectors.contributorTableLink.classList.remove('active');
    uiSelectors.repoTableLink.classList.add('active');

    const tableHead = document.getElementById('head');
    tableHead.innerHTML = ` 
        <tr>
            <th scope= "col">Name</th>
            <th scope= "col">Contributors</th>
        </tr>
    `;

    const tableBody = document.getElementById('body');
    tableBody.className = 'repo-table';
    tableBody.innerHTML ='';
    
    let data = pagination(repos, state.page, state.rows);


    data.trimmedData.forEach(repo => {
        let tableItem = document.createElement('tr')
        tableItem.classList = 'repo-link';
        tableItem.id = `${repo.fullname}`
    
        tableItem.innerHTML = `
            <td>${repo.fullname}</td>
            <td>${repo.contributors.length}</td>
        `
        tableBody.appendChild(tableItem);
    })

    pageButtons(data.pages, state)
    loadEventListeners();
}



//Contributor display State
const userState = function(id){
    uiSelectors.homepage.classList.add('hidden')
    uiSelectors.userDetails.classList.remove('hidden');
    uiSelectors.repoDetails.classList.add('hidden');
    uiSelectors.backButton.classList.remove('hidden');

    
    uiSelectors.userDetails.innerHTML = '';

   const currentContributor = uniqueContributors.find(el => el.id == id)
   let contributedRepos = [];

   repos.forEach(repo => {
        repo.contributors.forEach(contributor => {
            if(contributor.id == id){
                contributedRepos.push(repo);
            }
        })
   })

   uiSelectors.userDetails.innerHTML= `
        <div class="user container details">
                <h4 class="title">Contributor Details</h4>
                <div class="info">
                    <div class"col-lg-4 bio text-center">
                        <img class="bio__img" src="${currentContributor.avatar_url}">
                        <h4 class="bio__name">${currentContributor.name}</h4>
                        <p class ="bio__bio">${currentContributor.bio}</p>
                    </div>
                
                    <div class="col-lg-8 about">
                        <div class="about__texts">
                            <p class="about__text"><span class="bold">username:</span> ${currentContributor.login}</p>
                            <p class="about__text"><span class="bold">company:</span> ${currentContributor.company}</p>
                            <p class="about__text"><span class="bold">email:</span> ${currentContributor.email}</p>
                            <p class="about__text"><span class="bold">location:</span> ${currentContributor.location}</p>
                        </div>
                        <div class="about__numbers">
                                <div class="number_box">
                                <span class="number__lg">${currentContributor.followers}</span>
                                <p>Followers</p>
                                </div>
                                <div class="number_box">
                                <span class="number__lg">${currentContributor.following}</span>
                                <p>Following</p>
                                </div>
                                <div class="number_box">
                                <span class="number__lg">${currentContributor.public_repos}</span>
                                <p>Public Repos</p>
                                </div>
                                <div class="number_box">
                                <span class="number__lg">${currentContributor.public_gists}</span>
                                <p>Public Gists</p>
                                </div>
                        </div>
        
                    </div>
        
                </div>
        </div>
        <div class="contributed-repos">
            <div class="listTitle">
                <h4 class ="title">Contributed Repos</h4>
                <p>${currentContributor.name} has contributed to the following repos</p>
            </div>
        </div>
   `;
   let repoList = document.createElement('ul')
   repoList.className = 'reposList list__group';
   contributedRepos.forEach(repo => {
        let li = document.createElement('li');
        li.id = `${repo.fullname}`;
        li.className = 'list-item';

        li.innerText = `${repo.fullname}`;

        repoList.append(li);
   })


   document.querySelector('.contributed-repos').append(repoList);
   loadEventListeners();
}

// Repo display state
const repoState = function(name) {
    uiSelectors.homepage.classList.add('hidden')
    uiSelectors.userDetails.classList.add('hidden');
    uiSelectors.repoDetails.classList.remove('hidden');
    uiSelectors.backButton.classList.remove('hidden');

    
    uiSelectors.repoDetails.innerHTML = '';
    

    const currentRepo = repos.find(el => el.fullname == name)

    let repoOutput = document.createElement('div');
    repoOutput.innerHTML = `
    <div class="details">
        <h4 class="title">${currentRepo.fullname}</h4>
        <div class="about">
            <p><span class="bold">Description:</span> ${currentRepo.description}</p>
            <p><span class="bold">Watchers:</span> ${currentRepo.watchers}</p>
            <p><span class="bold">Stargazers:</span> ${currentRepo.stargazers}</p>
            <p><span class="bold">Created at:</span> ${currentRepo.created_at.slice(0, 10)}</p>    
            <p><span class="bold">Updated at:</span> ${currentRepo.updated_at.slice(0, 10)}</p>

        </div>
    </div>
    <div class="listTitle">
        <h4 class="title">Contributors [${currentRepo.contributors.length}]</h4>
    </div>
    `

    let contributorsOutput = document.createElement('ul')
    contributorsOutput.className = 'repo-contributors list__group'
    currentRepo.contributors.forEach(contributor => {
        let li = document.createElement('li');
        li.className = 'list-item';

        li.innerHTML = `<p><img src ="${contributor.avatar_url}">  ${contributor.login}  <span class="snaller">Contributions: ${contributor.contributions}</span></p>`;

        contributorsOutput.append(li);
   })

   repoOutput.append(contributorsOutput);
   uiSelectors.repoDetails.append(repoOutput);
   loadEventListeners();
}



// implement page state
class PageState {
    constructor () {}
    currentState = new homeState();

    async init () {
            console.log(this.number, this.string)
            await getData()
            this.change(new homeState);
    }

    change(stat){
        this.currentState = stat
    }
}

const app = new PageState(1, 'string');
app.init();



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
                const repoContributors = repo.contributors_url ? await getAllContributors(repo.contributors_url) : null;
    
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


   

