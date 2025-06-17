// app/playground.tsx
import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function Playground() {
  const [name, setName] = React.useState("");

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        Flexbox & Form Demo
      </Text>

      <View style={{ flexDirection: "row", height: 80, marginBottom: 20 }}>
        <View style={{ flex: 1, backgroundColor: "tomato" }} />
        <View style={{ flex: 2, backgroundColor: "skyblue" }} />
        <View style={{ width: 50, backgroundColor: "gold" }} />
      </View>

      <TextInput
        placeholder="Type your name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#888",
          borderRadius: 4,
          padding: 8,
          marginBottom: 12,
        }}
      />

      <Button
        title="Greet me"
        onPress={() => alert(`Hello, ${name || "stranger"}!`)}
      />
    </View>
  );
}
