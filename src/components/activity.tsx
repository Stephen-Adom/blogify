import { formatDistanceStrict } from "date-fns";
import { useAppSelector } from "../hooks/hooks";
import { Activity, UserBio } from "../utils/models/post.model";

function Activities() {
  const activities = useAppSelector((state) => state.user.userActivities);
  const userInfo: UserBio = useAppSelector(
    (state) => state.auth.authUserFullBio
  );
  const AllUsers = useAppSelector((state) => state.user.allUsers);

  const getUserInfo = (author: string) => {
    if (userInfo.id === author) {
      return userInfo.profilePic.downloadURL;
    } else {
      return AllUsers.find((user) => user.id === author)
        ? AllUsers.find((user) => user.id === author).profilePic.downloadURL
        : require("../assets/users/blank.png");
    }
  };

  const formatDate = (createdAt: string) => {
    return formatDistanceStrict(new Date(createdAt), new Date(), {
      addSuffix: true,
    });
  };

  const renderActivtySwtich = (activity: Activity) => {
    switch (activity.type) {
      case "like":
        console.log("author yes");
        return (
          <div className="symbol symbol-circle symbol-30 symbol-custom">
            <span className="symbol-label font-weight-bold">
              <i className="far fa-thumbs-up text-white"></i>
            </span>
          </div>
        );

      case "follow":
        console.log("author yes");
        return (
          <div className="symbol symbol-circle symbol-30 symbol-custom">
            <span className="symbol-label font-weight-bold">
              <i className="fas fa-user-plus text-white"></i>
            </span>
          </div>
        );

      case "comment":
        console.log("author yes");
        return (
          <div className="symbol symbol-circle symbol-30 symbol-custom">
            <span className="symbol-label font-weight-bold">
              <i className="flaticon2-chat-1 text-white"></i>
            </span>
          </div>
        );
    }
  };

  return (
    <section>
      {activities.length ? (
        <section>
          <section
            className="d-flex align-items-center justify-content-between"
            style={{ marginTop: "23px" }}
          >
            <h6 className="font-weight-bold text-muted">ACTIVITY</h6>
            <span className="label label-rounded label-success mr-2">
              {activities.length}
            </span>
          </section>

          <div className="card card-custom mt-4 user-activity-card">
            <div className="card-body">
              {activities.map((activity) => {
                return (
                  <div className="activity-info" key={activity.id}>
                    <section className="d-flex align-items-center">
                      <div className="symbol symbol-30 mr-3">
                        <img alt="Pic" src={getUserInfo(activity.author)} />
                      </div>
                      <div style={{ width: "70%" }} className="text-left">
                        <span>
                          <span className="font-weight-bold">
                            {activity.activity}
                          </span>
                          -
                          <span className="text-muted ml-3">
                            {formatDate(activity.createdAt)}
                          </span>
                        </span>
                      </div>
                    </section>

                    {renderActivtySwtich(activity)}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}

export default Activities;
