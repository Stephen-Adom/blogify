import React from "react";
import Activities from '../components/activity';
import Navigation from '../components/main-navigation';
import UserProfileCard from '../components/user-profile-card';

function AppSidebar() {
    return (
        <section>
            { /* START:: PROFILE SUMMARY */}

            <UserProfileCard></UserProfileCard>

            { /* END:: PROFILE SUMMARY */}

            {/* START:: MAIN NAVIGATION */}
            <Navigation></Navigation>
            {/* END:: MAIN NAVIGATION */}

            {/* START:: USER ACTIVITY SECTION */}
            <Activities></Activities>
            {/*  END:: USER ACTIVITY SECTION */}
        </section>
    )
}

export default AppSidebar;