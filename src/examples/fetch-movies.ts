// 4.2 순수 fetch 요청 확인 (임시로 main.tsx에서 import해서 Network 패널 확인)
import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
