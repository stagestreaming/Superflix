import React from 'react';
import VideoMainContainer from '../videos/video_main_container';
import VideoRowContainer from '../videos/video_row_container';
import { isEmpty } from 'lodash';

export default class GenreIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // fetch based on type prop or location.pathname?
    // need to account for only shows URL or specific shows/<genre> url?

    let genreQuery = this.props.match.params.genreId;

    if (this.props.type === "SHOWS") {
      if (genreQuery) {
        this.props.fetchOnlyShows(genreQuery);
      } else {
        this.props.fetchOnlyShows();
      }
    } else if (this.props.type === "MOVIES") {
      if (genreQuery) {
        this.props.fetchOnlyMovies(genreQuery);
      } else {
        this.props.fetchOnlyMovies();
      }
    }
  }

  componentDidUpdate(prevProps) {
    // maybe also check if changed types?
    // if ((prevProps.type !== this.props.type ||
    //   Object.keys(this.props.videos).length === 1 ||
    //   prevProps.location.pathname.startsWith("watch")) &&
    //   (isEmpty(this.props.videos) ||
    //   Object.keys(this.props.videos).length === 1 ||
    //   prevProps.location.pathname.startsWith("watch"))
    // ) {
    if (prevProps.type !== this.props.type ||
      prevProps.match.params.genreId !== this.props.match.params.genreId ||
      Object.keys(this.props.videos).length === 1 ||
      prevProps.location.pathname.startsWith("watch") ||
      isEmpty(this.props.videos)
    ) {
      let genreQuery = this.props.match.params.genreId;

      if (this.props.type === "SHOWS") {
        if (genreQuery) {
          this.props.fetchOnlyShows(genreQuery);
        } else {
          this.props.fetchOnlyShows();
        }
      } else if (this.props.type === "MOVIES") {
        if (genreQuery) {
          this.props.fetchOnlyMovies(genreQuery);
        } else {
          this.props.fetchOnlyMovies();
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.clearVideos();
  }

  render() {
    const { videos, genres, type } = this.props;
    const videosLength = Object.keys(videos).length;
    let typeLength;
    let genreHeader;

    if (type === "MOVIES") {
      typeLength = 24;
      genreHeader = "Movies";
    } else {
      typeLength = 8;
      genreHeader = "TV Shows";
    }

    // maybe make new slice of state to show that the back button was hit or something
    // will prevent having to hardcode checking how many videos are in the store to prevent back-button error
    let videoMain = isEmpty(videos) || videosLength !== typeLength ? "" : <VideoMainContainer video={Object.values(videos)[0]} genres={genres} />;
    let videoRows = isEmpty(videos) || videosLength !== typeLength ? "" : (
      Object.values(genres).map(genre => {
        // if (genre.name !== "Marvel" && genre.name !== "DC") {
          let videoIds = genre["videoIds"];
          let genreVideos = [];

          videoIds.forEach(id => {
            genreVideos.push(videos[id]);
          });

          return <VideoRowContainer key={genre.id} videos={genreVideos} genre={genre} type={type} />
        // }
      })
    );

    return (
      <div className="video-index-container">
        <span className="video-index-container-bg"></span>
        <div id="video-main-empty">
          <div className="genre-header">{genreHeader}</div>
          {videoMain}
        </div>
        <section className="video-row-container">
          {videoRows}
        </section>
      </div>
    );
  }
}