
import { setFilter } from "../store/action";
import Link from "./Link";

const mapStateToProps = (state, ownProps) => {
  return {
    active: state.filter === ownProps.fitler
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    click: function() {
      dispatch(setFilter(ownProps.filter));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);
