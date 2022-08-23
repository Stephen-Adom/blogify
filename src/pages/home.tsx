import React from "react";
import AddPost from "../components/addPost";
import FollowersStory from "../components/followers-story";
import PostList from "../components/post-list";
import Suggestions from "../components/suggestions-list";
import UserMessages from "../components/user-messages";

function Home(){
    return (
        <div id="home" className="row">
            <div className="col-lg-8 main-post-content">

                    {/** START:: FOLLOWERS STORY */}
                    <FollowersStory></FollowersStory>
                    {/** END:: FOLLOWERS STORY */}

                    {/** START:: ADD POST COMPONENT */}
                    <AddPost></AddPost>
                    {/** END:: ADD POST COMPONENT */}

                    <PostList></PostList>
                </div>
                <div className="col-lg-4 right-sidebar">
                    {/**START:: SUGGESTION SECTION */}
                        <Suggestions></Suggestions>
                    {/**END:: SUGGESTION SECTION */}

                   {/**START:: MESSAGES SECTION */}
                    <UserMessages></UserMessages>
                    {/* END:: MESSAGES SECTION */}

                </div>
        </div>
    )
}

export default Home;