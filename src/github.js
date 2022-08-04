 
    export async function get(url, pageNo = 1) {

        let actualUrl= `${url}?q=&per_page=10&page=${pageNo}`;
        let apiResponse= await fetch(actualUrl, {
          headers: {
              'authorization': 'token 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'
            }
          })
        

        let apiResults = await apiResponse.json()
        
        return apiResults ?? []
        
    }

    export async function getUser(url) {

      let apiResponse= await fetch(url, {
        headers: {
            'authorization': 'token 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'
          }
        })
      

      let apiResults = await apiResponse.json()
      
      return apiResults ?? []
      
  }

    export async function getAllRepos(pageNo = 1) {
        const results = await get(this.reposUrl, pageNo);
        // console.log("Retreiving data from API for page : " + pageNo);
        if (results.length>0) {
          return results.concat(await this.getAllRepos(pageNo+1));
        } else {
          return results;
        }
      }

   export async function getAllContributors(url, pageNo = 1) {
        const results = await get(url, pageNo);
        if (results.length>0) {
          return results.concat(await getAllContributors(url, pageNo+1));
        } else {
          return results;
    }

    }
