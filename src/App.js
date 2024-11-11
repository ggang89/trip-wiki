import CityDetail from "./components/CityDetail.js";
import CityList from "./components/CityList.js";
import Header from "./components/Header.js";
import RegionList from "./components/RegionList.js";

import { request } from "./components/api.js";

export default function App($app) {
  this.state = {
    startIdx: 0,
    sortBy: "",
    searchWord: "",
    region: "",
    cities: "",
  };

  const header = new Header();
  const regionList = new RegionList();
  const cityList = new CityList({
    $app, initialState: this.state.cities,
    handleLoadMore: async () => {
      //누르면 40개 데이터 더 불러오기
      const newStartIdx = this.state.startIdx + 40;
      const newCities = await request(newStartIdx, 
        this.state.region,
        this.state.sortBy,
        this.state.searchWord);
      this.setState({
        ...this.state,
        startIdx: newStartIdx,
        cities: {
          cities: [...this.state.cities.cities, ...newCities.cities],
          isEnd: newCities.isEnd,
        },
      });
    }
    
  });
  
  const cityDetail = new CityDetail();

  this.setState = (newState) => {
    this.state = newState;
    cityList.setState(this.state.cities);
  };

  const init = async () => {
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
  };

  init();
  //console.log($app)
}
