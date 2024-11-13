export default function Header({
  $app,
  initialState,
  handleSortChange,
  handleSearchWord,
}) {
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "header";

  this.handleSortChange = handleSortChange;
  this.handleSearchWord = handleSearchWord;

  $app.appendChild(this.$target);

  this.template = () => {
    const { sortBy, searchWord } = this.state;

    //header컴포넌트 요소 작성
    let temp = `
    <div class="title">
      <a href="/">🛫Trip Wiki</a>
    </div>
    <div class="filter-search-container">
      <div class="filter">
        <select id="sortList" class="sort-list">
          <option value="total" ${
            sortBy === "total" ? "selected" : ""
          }>Total</option>
          <option value="cost" ${
            sortBy === "cost" ? "selected" : ""
          }>Cost</option>
          <option value="fun" ${sortBy === "fun" ? "selected" : ""}>Fun</option>
          <option value="safety" ${
            sortBy === "safety" ? "selected" : ""
          }>Safety</option>
          <option value="internet" ${
            sortBy === "internet" ? "selected" : ""
          }>Internet</option>
          <option value="air" ${
            sortBy === "air" ? "selected" : ""
          }>Air Quality</option>
          <option value="food" ${
            sortBy === "food" ? "selected" : ""
          }>Food</option>
        </select>
      </div>
      <div class="search">
        <input type="text" placeholder="Search" id="search" autocomplete="off" value=${searchWord} >
      </div>
    </div>`;

    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
    //select 태그가 변경될 때마다
    document.getElementById("sortList").addEventListener("change", (event) => {
      this.handleSortChange(event.target.value);
    });
    const $serachInput = document.getElementById("search");
    document.getElementById("search").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.handleSearchWord($serachInput.value);
      }
    });
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
