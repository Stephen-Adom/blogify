import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { useAppSelector } from "../hooks/hooks";
import { format } from "date-fns";
import { useAppDispatch } from "./../hooks/hooks";
import { openProfileUpdate } from "../hooks/reducers/app.reducer";
import ProfileLoader from "../components/loaders/profile-loader";

export default function Profile() {
  const userInfo = useAppSelector((state) => state.auth.authUserFullBio);
  const allPosts = useAppSelector((state) => state.post.allPosts);
  const allFollowing = useAppSelector((state) => state.user.userRelations);
  const allFollowers = useAppSelector((state) => state.user.myFollowers);
  const dispatch = useAppDispatch();

  const getAuthUserPost = (): number => {
    if (userInfo) {
      return allPosts.filter((post) => post.author.id === userInfo.id).length;
    }

    return 0;
  };

  const getCreatedAtDate = () => {
    if (userInfo) {
      return format(new Date(userInfo.createdAt), "MMMM, yyyy");
    }

    return null;
  };

  return (
    <section id="profile">
      {userInfo ? (
        <section>
          <div
            className="user-profile-banner"
            style={{
              backgroundImage: `url(${require("../assets/images/profile-banner.jpg")})`,
            }}
          >
            <div className="symbol symbol-140">
              <img
                alt="Pic"
                src={
                  userInfo.profilePic.downloadURL
                    ? userInfo.profilePic.downloadURL
                    : require("../assets/users/blank.png")
                }
              />
            </div>
          </div>
          <div className="card card-custom user-info-card">
            <div className="card-body">
              <div className="row">
                <div className="col-2"></div>
                <div className="col-10">
                  <div className="d-flex align-items-start justify-content-between">
                    <section className="text-left">
                      <h4 className="display-4 font-weight-bold">
                        {userInfo.firstname} {userInfo.lastname}
                      </h4>
                      <span className="d-block text-muted">
                        @{userInfo.username}
                      </span>
                    </section>

                    <section className="d-flex align-items-center">
                      <div className="mr-5">
                        <h4 className="font-weight-bolder text-primary">
                          Posts
                        </h4>
                        <h5 className="d-block font-weight-bold">
                          {getAuthUserPost()}
                        </h5>
                      </div>

                      <div className="mr-5">
                        <h4 className="font-weight-bolder text-primary">
                          Followers
                        </h4>
                        <h5 className="d-block font-weight-bold">
                          {allFollowers.length}
                        </h5>
                      </div>

                      <div>
                        <h4 className="font-weight-bolder text-primary">
                          Following
                        </h4>
                        <h5 className="d-block font-weight-bold">
                          {allFollowing.length}
                        </h5>
                      </div>
                    </section>
                    <section>
                      <button
                        onClick={() => dispatch(openProfileUpdate())}
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        <i
                          className="pi pi-pencil mr-2"
                          style={{ fontSize: "12px" }}
                        ></i>
                        Edit Profile
                      </button>
                    </section>
                  </div>
                </div>
              </div>

              <Divider type="dashed"></Divider>

              <div className="row text-left">
                <span className="d-block font-weight-bold text-muted">
                  MY BIO
                </span>

                <div className="mt-3 ">
                  <p className="bio-text">
                    {userInfo.bio ? userInfo.bio : "Not Available"}
                  </p>
                </div>

                <Divider type="dashed"></Divider>

                <div className="user-additional-info">
                  <div className="info-item">
                    <span className="d-block mr-3">
                      <i className="flaticon2-gift-1"></i>
                    </span>
                    <span className="d-block">
                      {userInfo.dob ? userInfo.dob : "Not Available"}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="d-block mr-3">
                      <i className="pi pi-map-marker"></i>
                    </span>
                    <span className="d-block">
                      {userInfo.location ? userInfo.location : "Not Available"}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="d-block mr-3">
                      <i className="pi pi-link"></i>
                    </span>
                    <span className="d-block">
                      {userInfo.website ? userInfo.website : "Not Available"}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="d-block mr-3">
                      <i className="pi pi-calendar"></i>
                    </span>
                    <span className="d-block">
                      Joined On {getCreatedAtDate()}
                    </span>
                  </div>
                </div>
              </div>

              <Divider type="dashed"></Divider>

              <TabView>
                <TabPanel header="My Posts">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </TabPanel>
                <TabPanel header="Comments">
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo. Nemo
                    enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                    aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt. Consectetur, adipisci
                    velit, sed quia non numquam eius modi.
                  </p>
                </TabPanel>
                <TabPanel header="Media">
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident, similique sunt in culpa
                    qui officia deserunt mollitia animi, id est laborum et
                    dolorum fuga. Et harum quidem rerum facilis est et expedita
                    distinctio. Nam libero tempore, cum soluta nobis est
                    eligendi optio cumque nihil impedit quo minus.
                  </p>
                </TabPanel>
                <TabPanel header="Likes">
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident, similique sunt in culpa
                    qui officia deserunt mollitia animi, id est laborum et
                    dolorum fuga. Et harum quidem rerum facilis est et expedita
                    distinctio. Nam libero tempore, cum soluta nobis est
                    eligendi optio cumque nihil impedit quo minus.
                  </p>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </section>
      ) : (
        <ProfileLoader></ProfileLoader>
      )}
    </section>
  );
}
