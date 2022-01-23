import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const getUsersList = createAsyncThunk(
  'getUsersList',
  async (data, thunkAPI) => {
    const response = await fetch(
      'https://koushik-node-users.herokuapp.com/api/user',
    );
    const jsonData = await response.json();
    return jsonData.data;
  },
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    usersList: [],
  },
  reducers: {
    storeUsersData: (state, action) => {
      state.usersList = action.payload;
      console.log('action.payload', action.payload);
    },
  },
  extraReducers: {
    [getUsersList.fulfilled]: (state, action) => {
      state.usersList = action.payload;
    },
    [getUsersList.pending]: (state, action) => {
      state.usersList = [];
    },
    [getUsersList.rejected]: (state, action) => {
      state.usersList = [];
    },
  },
});
export const {storeUsersData} = counterSlice.actions;
export {getUsersList};
export default counterSlice.reducer;
