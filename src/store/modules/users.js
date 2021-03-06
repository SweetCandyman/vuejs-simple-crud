const state = {
  all: [],
  tableColumns: ['id', 'name', 'email', 'phone', 'zipcode'],
};

const getters = {
  allUsers: () => state.all,
};

const actions = {
  fetchUsers({ commit, dispatch }) {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        // Reject the promise on error from API
        return Promise.reject(Error(`Response Code ${response.status}`));
      }).then((data) => {
        // Start the data map based on response from API to meet our needs
        const condensedUserData = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          zipcode: user.address.zipcode,
        }
        ));
        commit('SET_ALL_USERS', condensedUserData);
        // Dispatch 2 actions to the tables state management. Set column headers
        // and data for the table.
        dispatch('tables/selectedTable', {
          name: 'users',
          columnHeaders: state.tableColumns,
          data: state.all,
        }, { root: true });
        // dispatch('tables/finishLoadingTable', {}, { root: true });
        // Pass through error from rejected promise
      }).catch(error => console.error(error));
  },
  deleteById({ commit }, userId) {
    commit('DELETE_USER_BY_ID', userId);
  },
};
const mutations = {
  // Mutation that sets the data from the API to the state object property
  SET_ALL_USERS(state, users) {
    // Mapped only the columns needed for the example
    state.all = users;
  },
  DELETE_USER_BY_ID(state, id) {
    // Match the index of the array for the userId. Needed because splice mutates the array.
    const matchIndex = state.all.findIndex(entry => entry.id === id);
    state.all.splice(matchIndex, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
