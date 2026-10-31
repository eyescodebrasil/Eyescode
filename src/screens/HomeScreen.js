import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";



import RewardsSection
  from "../components/home/RewardsSection";

import PeopleToFollow
  from "../components/home/PeopleToFollow";

import CommunityPosts
  from "../components/home/CommunityPosts";

import CommunitiesSection
  from "../components/home/CommunitiesSection";

import LivesSection
  from "../components/home/LivesSection";

import FeaturedLives
  from "../components/home/FeaturedLives";

import HomeQuickActions
  from "../components/home/HomeQuickActions";

import Header from "../components/Header";
import { colors } from "../theme/colors";

export default function HomeScreen({
  onNavigate
}) {



  return (
    <View style={styles.container}>
     <Header
  onNavigate={onNavigate}
/> >

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        
 <HomeQuickActions />
<FeaturedLives />
<LivesSection />
<CommunityPosts />
<CommunitiesSection />
<RewardsSection />
<PeopleToFollow />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },


  scroll: {
    flex: 1,
  },

  content: {
    paddingBottom: 24,
  },
});