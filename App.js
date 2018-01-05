import React, { Component } from "react";
import {
  ListView,
  StyleSheet,
  Text,
  View,
  WebView,
  RefreshControl
} from "react-native";
import { List, ListItem } from "react-native-elements";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class App extends React.Component {
  state = {
    data: ds.cloneWithRows([]),
    redditUrl: "",
    refreshing: false
  };
  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ refreshing: true });
    const response = await fetch("https://api.reddit.com/r/pics/new.json");
    const json = await response.json();
    this.setState({
      data: ds.cloneWithRows(json.data.children),
      refreshing: false
    });
  };

  renderReddit() {
    console.log(this.state.redditUrl);
    if (!this.state.redditUrl) return null;
    return (
      <WebView
        source={{ uri: `https://i.reddit.com${this.state.redditUrl}` }}
        style={{ marginTop: 20 }}
      />
    );
  }

  render() {
    console.log("Render");
    return (
      <View>
        <List>
          <ListView
            enableEmptySections={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchData.bind(this)}
              />
            }
            dataSource={this.state.data}
            keyExtractor={(x, i) => i}
            renderRow={item => {
              const date = new Date(item.data.created * 1000);
              const formattedDate =
                ("0" + date.getDate()).slice(-2) +
                "/" +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                "/" +
                date.getFullYear();
              return (
                <ListItem
                  onPress={() =>
                    this.setState({ redditUrl: item.data.permalink })
                  }
                  avatar={{ uri: item.data.thumbnail }}
                  titleNumberOfLines={1}
                  title={item.data.title}
                  subtitleNumberOfLines={2}
                  subtitle={`Author:${item.data.author}  Score:${
                    item.data.score
                  }  Comments:${item.data.num_comments}    ${formattedDate}`}
                />
              );
            }}
          />
        </List>
      </View>
    );
  }
}
