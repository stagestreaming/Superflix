import React from 'react';
import VideoItemContainer from './video_item_container';
import VideoDetailsContainer from './video_details_container';
import { Route } from 'react-router-dom';

export default class VideoRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: this.props.videos, // all the videos ever in this genre
      genre: this.props.genre,
      pageNum: 0,
      videosRemaining: this.props.videos.length,
      showButtonArrow: false,
      detailsHidden: {id: null, value: true}, // the thumbnail details for the item being hovered over
      detailsShowing: true // the big detail pane
    }

    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.toggleArrow = this.toggleArrow.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
  }

  toggleArrow(e) {
    this.setState({
      showButtonArrow: !this.state.showButtonArrow
    });
  }

  scrollLeft(e) {
    e.preventDefault();
    const { pageNum, videosRemaining, showButtonArrow } = this.state;

    this.setState({
      pageNum: pageNum-1,
      videosRemaining: videosRemaining + 6,
      showButtonArrow: pageNum === 0 ? false : showButtonArrow
    });
  }

  scrollRight(e) {
    e.preventDefault();
    const { pageNum, videosRemaining } = this.state;
    let newVideosRemaining = videosRemaining-6;
    let newPageNum;

    if (newVideosRemaining <= 0) {
      newPageNum = 0;
      newVideosRemaining = this.props.videos.length;
    } else {
      newPageNum = pageNum+1;
    }

    this.setState({
      pageNum: newPageNum,
      videosRemaining: newVideosRemaining
    });
  }

  playVideo(id) {
    return e => {
      let video = e.currentTarget.childNodes[1].childNodes[0];
      video.play();

      this.setState({ detailsHidden: { id: id, value: false } })
      // setTimeout(() => this.setState({ detailsHidden: {id: id, value: false} }), 400);
    };
  }

  stopVideo(id) {
    return e => {
      let video = e.currentTarget.childNodes[1].childNodes[0];
      video.pause();

      this.setState({ detailsHidden: {id: null, value: false} });
    };
  }

  closeDetails() {
    this.setState({
      detailsShowing: false,
      detailsHidden: {id: null, value: true}
    });

    // debugger;

    setTimeout(() => {
      this.props.history.push("/browse");
    }, 600);
  }

  renderLessThanSixVideos() {
    const { videos, detailsHidden } = this.state;
    const { genre } = this.props;
    
    let videoItems = videos.map((video, i) => {
      let className = "video-item";
      if (i === 0) className = "first " + className;

      return <VideoItemContainer
        key={i}
        video={video}
        className={className}
        myGenre={genre}
        playVideo={this.playVideo(video.id)}
        stopVideo={this.stopVideo(video.id)}
        detailsHidden={detailsHidden}
      />;
    });
    
    return (
      <>
        <h1 className="video-row-genre">{genre.name}</h1>
        <div className="individual-row-container">
          <ul className="video-row-outer">
            {/* <h1 className="video-row-genre">{genre.name}</h1> */}
            <ul className="video-row-inner">
              {videoItems}
            </ul>
          </ul>

          {/* <Route path={`/browse/${genre.name.toLowerCase()}/:movieId`} component={VideoDetailsContainer} closeDetails={this.closeDetails}/> */}
          <Route
            path={`/browse/${genre.name.toLowerCase()}/:movieId`}
            render={(props) => <VideoDetailsContainer closeDetails={this.closeDetails} {...props} />}
          />
        </div>
      </>
    );
  }

  renderMoreThanSixVideos() {
    const { videos, videosRemaining, pageNum, showButtonArrow, detailsHidden } = this.state;
    const { genre } = this.props;
    let currentIndex = pageNum*6;
    let videoItems;

    let translateStyle = pageNum === 0 ? ({
      transform: `none`,
      transition: "all 400ms ease-out"
    }) : ({
      transform: `translate3d(-${100 * pageNum}%, 0, 0)`,
      transition: "all 800ms ease-out"
    });

    if (videosRemaining > 0) {
      videoItems = videos.map((video, i) => {
        let className;

        if (i === currentIndex) {
          className = "first video-item";
        } else if (i === currentIndex + 5) {
          className = "last video-item"
        } else if (i < currentIndex || i > currentIndex + 5) {
          className = "off-screen video-item"
        } else {
          className = "video-item"
        }

        return <VideoItemContainer
          key={i}
          video={video}
          className={className}
          myGenre={genre}
          playVideo={this.playVideo(video.id)}
          stopVideo={this.stopVideo(video.id)}
          detailsHidden={detailsHidden} />;
      });
    } else {
      let className;

      videoItems = videos.map((video, i) => {
        if (i === currentIndex) {
          className = "first video-item"
        } else if (i < currentIndex) {
          className = "off-screen video-item"
        } else {
          className = "video-item"
        }

        return <VideoItemContainer key={i} video={video} className={className} myGenre={genre} playVideo={this.playVideo(video.id)} stopVideo={this.stopVideo(video.id)} detailsHidden={detailsHidden} />
      });
    }

    let leftButton = (
      <button
        className="left row-button"
        type="button"
        onClick={this.scrollLeft}
        onMouseEnter={this.toggleArrow}
        onMouseLeave={this.toggleArrow}
      >
        {showButtonArrow ? <i className="fas fa-chevron-left"></i> : ""}
      </button>
    );

    let rightButton = (
      <button
        className="right row-button"
        type="button"
        onClick={this.scrollRight}
        onMouseEnter={this.toggleArrow}
        onMouseLeave={this.toggleArrow}
      >
        {showButtonArrow ? <i className="fas fa-chevron-right"></i> : ""}
      </button>
    );

    return (
      <>
        <h1 className="video-row-genre">{genre.name}</h1>
        <div className="individual-row-container">
          <ul className="video-row-outer">
            {/* if videos.length <= 6, don't show any buttons */}
            {pageNum !== 0 ? leftButton : ""}

            <ul className="video-row-inner" style={translateStyle}>
              {videoItems}
            </ul>

            {rightButton}
          </ul >
          
          <Route
            path={`/browse/${genre.name.toLowerCase()}/:movieId`}
            render={(props) => <VideoDetailsContainer closeDetails={this.closeDetails} {...props} />}
          />
        </div>
      </>
    );
  }

  render() {
    const { videos } = this.state;

    return videos.length <= 6 ? (
      this.renderLessThanSixVideos()
    ) : (
      this.renderMoreThanSixVideos()
    )
  }
}