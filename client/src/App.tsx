import  {useContext, useEffect} from 'react';

import { Context } from '.';
import { observer } from "mobx-react-lite"
import Header from './components/Header';

import RegisterPage from './pages/RegisterPage';
import {Routes, Route }from 'react-router-dom';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
    // const [board, setBoard] = useState(new Board());

    // useEffect(() =>{
    //     restart()
    // },[ ])

    // function restart() : void{
    //     const newBoard = new Board();
    //     newBoard.initCells();
    //     newBoard.addFigures();
    //     setBoard(newBoard);
    // }

    const {store} = useContext(Context);
    
    useEffect(() => {
      if(localStorage.getItem('token')){
        store.checkAuth();
      }
    },[]);

    // return (
    //   <div className={'app'}>
    //     <BoardComponent board={board} setBoard={setBoard}/>
    //   </div>
    // );
    return (
      <>
      <Header/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/game/:id" element={<GamePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<RegisterPage/>}/>
        <Route path="/profile/:id" element={<ProfilePage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      </>
      );
};

export default observer(App);
