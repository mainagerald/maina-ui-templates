import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentPage, setPageTheme, PageTheme } from '../store/navigationSlice';

export const useNavigation = () => {
  const dispatch = useDispatch();
  const { currentPage, pageTheme } = useSelector((state: RootState) => state.navigation);

  const updateCurrentPage = (page: string) => {
    dispatch(setCurrentPage(page));
  };

  const updatePageTheme = (theme: PageTheme) => {
    dispatch(setPageTheme(theme));
  };

  return {
    currentPage,
    pageTheme,
    updateCurrentPage,
    updatePageTheme,
  };
};
