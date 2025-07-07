import { CommonGet } from "../common/httpClient";
import { toast } from "react-toastify";

// Permission check function
export const checkPermissions = async (roleID, screenID) => {
  console.log("role response:", roleID);
  console.log("sc response:", screenID);
  try {
    const response = await CommonGet(
      `/Permission/GetPermissionByRoleIDAndScreenID?roleID=${roleID}&screenID=${screenID}`
    );

    if (response?.statusCode === "SUCCESS" && response.data?.length > 0) {
      return response.data[0]; // Return the first permission object
    }
    return null;
  } catch (error) {
    console.error("Permission check error:", error);
    toast.error("Failed to check permissions");
    return null;
  }
};

// Higher-order component for permission checking (optional for future use)
export const withPermissionCheck = (WrappedComponent, screenID) => {
  return (props) => {
    const { user } = props;
    const [permission, setPermission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPermission = async () => {
        const perm = await checkPermissions(user.roleID, screenID);
        setPermission(perm);
        setLoading(false);
      };

      fetchPermission();
    }, [user.roleID]);

    if (loading) {
      return <div>Loading permissions...</div>;
    }

    if (!permission?.canView) {
      return <div>You don't have permission to view this page.</div>;
    }

    return <WrappedComponent {...props} permission={permission} />;
  };
};
