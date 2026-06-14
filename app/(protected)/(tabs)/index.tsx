import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useMutation, usePaginatedQuery } from "convex/react";
import { useAuth } from "@clerk/expo";

import { api } from "@/convex/_generated/api";

export default function Page() {
  const { signOut } = useAuth();

  const [parkName, setParkName] = useState("");
  const [caption, setCaption] = useState("");

  const createPost = useMutation(api.posts.createPost);

  const { results, loadMore, status } = usePaginatedQuery(
    api.posts.getFeedPosts,
    {},
    { initialNumItems: 10 },
  );

  const createDummyPost = async () => {
    try {
      await createPost({
         parkName: parkName || "Test Park",
         caption: caption || "My first post",
      });

      setParkName("");
      setCaption("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Landmarks
      </Text>

      <TextInput
        placeholder="Park name"
        value={parkName}
        onChangeText={setParkName}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Caption"
        value={caption}
        onChangeText={setCaption}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        onPress={createDummyPost}
        style={{
          backgroundColor: "black",
          padding: 14,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Create Post
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        Feed
      </Text>

      {results?.map((post: any) => (
        <View
          key={post._id}
          style={{
            borderWidth: 1,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <Text>{post.parkName}</Text>
          <Text>{post.caption}</Text>
        </View>
      ))}

      {status === "CanLoadMore" && (
        <TouchableOpacity
          onPress={() => loadMore(10)}
          style={{
            backgroundColor: "#ddd",
            padding: 12,
            marginBottom: 20,
          }}
        >
          <Text>Load More</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => signOut()}
        style={{
          backgroundColor: "red",
          padding: 14,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}