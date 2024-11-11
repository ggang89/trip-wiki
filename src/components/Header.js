export default function Header({ $app, initialState, handSortChange, handleSearchWord }) {
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "header";

  this.handSortChange = handSortChange;
  this.handleSearchWord = handleSearchWord;

  this.template = () => {};

  this.render = () => {};

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}