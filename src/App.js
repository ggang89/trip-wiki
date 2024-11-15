import CityDetail from "./components/CityDetail.js";
import CityList from "./components/CityList.js";
import Header from "./components/Header.js";
import RegionList from "./components/RegionList.js";

import { request, requestCityDetail } from "./components/api.js";

export default function App($app) {
  const getSortBy = () => {
    if (window.location.search) {
      return window.location.search.split("sort=")[1].split("&")[0]; //Aisa?sort=cost&search=korea =>cost
    }
    return "total";
  };

  const getSearchWord = () => {
    if (window.location.search && window.location.search.includes("search=")) {
      return window.location.search.split("search=")[1]; //Aisa?sort=total&search=korea에서 korea반환
    }
    return "";
  };

  this.state = {
    startIdx: 0,
    sortBy: getSortBy(),
    searchWord: getSearchWord(),
    region: window.location.pathname.replace('/',''),
    cities: "",
    currentPage: window.location.pathname,
  };

  const renderHeader = () => {
    new Header({
      $app,
      initialState: {
        currentPage: this.state.currentPage,
        sortBy: this.state.sortBy,
        searchWord: this.state.searchWord,
      },
      //정렬기준 변경 시 실행될 함수
      handleSortChange: async (sortBy) => {
        const pageUrl = `/${this.state.region}?sort=${sortBy}`;

        //history.pushState(state,title,url)
        //url=>검색값이 존재하면 url에 추가해주고 없으면 url만 쓰기
        history.pushState(
          null,
          null,
          this.state.searchWord
            ? pageUrl + `&search=${this.state.searchWord}`
            : pageUrl
        );
        //변경된 데이터가 적용된 새로운 값
        const cities = await request(
          0,
          this.state.region,
          sortBy,
          this.state.searchWord
        );
        //index는 0부터 다시 시작하고, 변경된 sortBy만 바꿔주고, 나머지는 그대로 매개변수 받음
        this.setState({
          ...this.state,
          startIdx: 0,
          sortBy: sortBy,
          cities: cities,
          //변경된 값만 다시 바꿔서 state바꿔줌(정렬기준과 정렬기준으로 뽑은 도시)
        });
      },

      //검색어로 찾을 때
      handleSearchWord: async (searchWord) => {
        history.pushState(
          null,
          null,
          `/${this.state.region}?sort=${this.state.sortBy}&search=${searchWord}`
        );

        //새로운 검색어로 뽑은 새 도시들을 cities상수에 넣어줌
        const cities = await request(
          0,
          this.state.region,
          this.state.sortBy,
          searchWord
        );

        //새로운 값을 넣어서 state 업데이트 시킴
        this.setState({
          ...this.state,
          startIdx: 0,
          cities: cities,
          searchWord: searchWord,
        });
      },
    });
  }

   const renderRegionList = () => {
     new RegionList({
       $app,
       initialState: this.state.region,
       handleRegion: async (region) => {
         history.pushState(null, null, `/${region}?sort=total`);
         const cities = await request(0, region, "total");
         this.setState({
           ...this.state,
           startIdx: 0,
           sortBy: "total",
           region: region,
           cities: cities,
           searchWord: "",
           currentPage: `/${region}`,
         });
       },
     });
   };


  const renderCityList = () => {
    new CityList({
      $app,
      initialState: this.state.cities,
      handleItemClick: async (id) => {
        history.pushState(null, null, `/city/${id}`);
        this.setState({
          ...this.state,
          currentPage: `/city/${id}`,
        });
      },
      handleLoadMore: async () => {
        //누르면 40개 데이터 더 불러오기
        const newStartIdx = this.state.startIdx + 40;
        const newCities = await request(
          newStartIdx,
          this.state.region,
          this.state.sortBy,
    
        );

        this.setState({
          ...this.state,
          startIdx: newStartIdx,
          cities: {
            cities: [...this.state.cities.cities, ...newCities.cities],
            isEnd: newCities.isEnd, //false=불러올 데이터 있음
          },
        });
      },
    });
  };

  const renderCityDetail = async(cityId) => {
    try {
      const cityDetailData = await requestCityDetail(cityId);
       new CityDetail({$app,initialState:cityDetailData});
    } catch (error) {
      console.log(error)
    }
   
  } 

  this.setState = (newState) => {
    this.state = newState;
    render();
  };

  const render = () => {
    const path = this.state.currentPage;
    $app.innerHtml = '';
    //상세페이지로 이동
    if (path.startsWith('/city/')) {
      const cityId = path.split('/city/')[1];
      renderHeader();
      renderCityDetail(cityId);
    } else {
      renderHeader();
      renderRegionList();
      renderCityList();
    }
  };

  window.addEventListener('popstate', async () => {
    const urlPath = window.location.pathname;

   const prevRegion = urlPath.replace("/", "");
   const prevPage = urlPath;
   const prevSortBy = getSortBy();
   const prevSearchWord = getSearchWord();
   const prevStartIdx = 0;
   const prevCities = await request(
     prevStartIdx,
     prevRegion,
     prevSortBy,
     prevSearchWord
   );

   this.setState({
     ...this.state,
     startIdx: prevStartIdx,
     sortBy: prevSortBy,
     region: prevRegion,
     currentPage: prevPage,
     searchWord: prevSearchWord,
     cities: prevCities,
   });
  });

  const init = async () => {
   const path = this.state.currentPage;
   
    if (!path.startsWith("/city/")) {
      const cities = await request(
        this.state.startIdx,
        this.state.region,
        this.state.sortBy,
        this.state.searchWord
      );
      this.setState({
        ...this.state,
        cities: cities,
      });
    } //상세 페이지
    else {
      render();
    }
  };

  init();
}
