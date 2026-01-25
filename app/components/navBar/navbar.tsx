import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type NavbarProps = {
  isLoggedIn: boolean; // controls login/logout
  onLogout?: () => void; // optional logout handler
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const router = useRouter();

  return (
    <View className="flex-row justify-center items-center mt-5 gap-2.5">
      {!isLoggedIn ? (
        <>
          <TouchableOpacity
            className="bg-blue-500 py-2.5 px-4 rounded-lg"
            onPress={() => router.push("/auth/vendor-login")}
          >
            <Text className="text-white font-bold">Login as Vendor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 py-2.5 px-4 rounded-lg"
            onPress={() => router.push("/auth/user-login")}
          >
            <Text className="text-white font-bold">Login as User</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          className="bg-red-500 py-2.5 px-6 rounded-lg"
          onPress={onLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Navbar;
