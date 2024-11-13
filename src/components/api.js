const API_URI = "https://trip-wiki-api.vercel.app/?start=0";

export const request = async (startIdx, region, sortBy, searchWord) => {
  try {
    let url = `${API_URI}`;
    //선택된 지역이 있고, 그게 all이 아니라면
    if (region && region !== "All") {
      //url 뒤에 지역명을 적고, startIdx를 매개변수로 넣어줌
      url += `${region}?start=${startIdx}`;
    } else {
      //만약 all이 선택되면, 지역명 없이 startIdx값만 넣어줌
      url += `start=${startIdx}`;
    }

    //만약 정렬기준이 있다면
    if (sortBy) {
      //추가해준다
      url += `&sort=${sortBy}`;
    }

    //만약 검색어가 있다면
    if (searchWord) {
      //추가해준다
      url += `&search=${searchWord}`;
    }

    const response = await fetch(url);
    if (response) {
      let data = await response.json();
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};
