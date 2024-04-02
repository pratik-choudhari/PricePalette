/* eslint-disable */
import {
  Group,
  ScrollArea,
  Button,
  Card,
  Image,
  Text,
  Container,
  Title,
  UnstyledButton,
  Box,
  ThemeIcon,
  rem,
  Modal,
  Skeleton,
  Tooltip,
} from "@mantine/core";
import {
  IconTemplate,
  IconDashboard,
  IconSettings,
  IconEye,
} from "@tabler/icons-react";
import classes from "../styles/navbarnested.module.css";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { backendAPI } from "@/utils/constants";
import request from "superagent";
import { NoDataIcon } from "@/illustrations/NoData";
import { Header } from "@/components/Header";
import ProfileModal from "@/components/ProfileModal";
import { AuthOrNot } from "@/components/AuthOrNot";
import superagent from "superagent";
import { InstallWidgetModal } from "@/components/InstallWidgetModal";
import { useCurrentWidgetId } from "@/stores/useCurrentWidgetId";

const mockdata = [
  {
    label: "Templates",
    icon: IconTemplate,
    link: "/templates",
  },
  { label: "Profile Settings", icon: IconSettings, link: "/settings" },
  { label: "View Plans", icon: IconDashboard, link: "/viewPlans" },
];

export default function Dashboard() {
  const router = useRouter();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isInstallWidgetModalOpen, setInstallWidgetModalOpen] = useState(false);
  const currentWidgetId = useCurrentWidgetId((state) => state.currentWidgetId);
  const setCurrentWidgetId = useCurrentWidgetId(
    (state) => state.setCurrentWidgetId
  );

  const { data, isLoading } = useQuery({
    queryKey: ["WidgetsListQuery", { id: 1 }],
    queryFn: () =>
      superagent
        .get(`${backendAPI}/widget/list`)
        .set("Accept", "application/json")
        .set(
          "Authorization",
          `Bearer ${localStorage.getItem("pp_access_token")}`
        )
        .then((res) => res.body.content)
        .catch((error) => error.response.body),
  });

  const deleteWidget = async (widgetId: any) => {
    const jwtToken = localStorage.getItem("pp_access_token");
    await request
      .delete(`${backendAPI}/widget/delete?widgetId=${widgetId}`)
      .set("Authorization", `Bearer ${jwtToken}`);
  };

  const {
    mutate: deleteWidgetMutate,
    error: deleteError,
    isError,
  } = useMutation(deleteWidget, {
    onSuccess: () => {
      setDeleteModalOpen(false);
      router.reload();
    },
    onError: (error) => {
      console.error(deleteError);
    },
  });

  const handleDelete = (widgetId: any) => deleteWidgetMutate(widgetId);

  const handleCreateWidget = () => {
    router.push("/templates");
  };

  const handleEdit = (templateId: any, widgetId: any) => {
    router.push(`/template/edit/${templateId}/?widget=${widgetId}`);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  return (
    <AuthOrNot>
      <div>
        <Header />
        <div style={{ display: "flex", height: "100vh" }}>
          {/* Navbar */}
          <nav className={classes.navbar}>
            <ScrollArea className={classes.links}>
              {mockdata.map(({ label, icon: Icon, link }) => (
                <UnstyledButton
                  key={label}
                  className={classes.control}
                  onClick={() => {
                    if (label === "Profile Settings") {
                      handleProfileClick();
                    } else {
                      router.push(link);
                    }
                  }}
                >
                  <Group justify="space-between" gap={0}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <ThemeIcon variant="light" size={30}>
                        <Icon style={{ width: rem(18), height: rem(18) }} />
                      </ThemeIcon>
                      <Box ml="md">{label}</Box>
                    </Box>
                  </Group>
                </UnstyledButton>
              ))}
            </ScrollArea>
          </nav>
          {/* Content */}
          <Container fluid={true} className={classes.container}>
            <Title order={2} my="md">
              Welcome Back
            </Title>
            <div style={{ width: "100%" }}>
              <Button onClick={handleCreateWidget} my="md">
                Create Widget
              </Button>

              <Title order={3} my="lg">
                Widgets
              </Title>

              {isLoading ? (
                <Skeleton height={150} />
              ) : data && data.length > 0 ? (
                data.map((item: any, index: any) => (
                  <Card
                    key={index}
                    withBorder
                    radius="md"
                    className={classes.card}
                  >
                    <div className={classes.cardContent}>
                      <Group>
                        <img
                          src={
                            item.templateIdUsed ===
                            "21c86e6a-eac0-4278-8fb4-30e80bb23026"
                              ? "/Curved Card.svg"
                              : item.templateId ===
                                "1905d495-6371-4b2a-9f6a-c4a586e0d216"
                              ? "/Section Card.svg"
                              : "/Leaf Card.svg"
                          }
                          alt={"template skeleton"}
                          width={160}
                          height={160}
                        />
                        <div className={classes.body}>
                          <Text className={classes.title} mt="xs">
                            {item.title}
                          </Text>
                          <Text
                            c="dimmed"
                            fw={700}
                            size="xs"
                            style={{ marginTop: "0.2em" }}
                          >
                            {item.description}
                          </Text>
                          <Tooltip label="Widget Views">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "0.5em",
                                width: "100px",
                                cursor: "pointer",
                              }}
                            >
                              <IconEye width={25} height={25} color="#868E96" />
                              <Text c="dimmed" fw={700} size="xs" ml={"xs"}>
                                {item.views ? item.views : 0}
                              </Text>
                            </div>
                          </Tooltip>
                        </div>
                      </Group>
                      <div
                        className={classes.buttonsRight}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "flex-end",
                            marginBottom: "auto",
                          }}
                        >
                          <Button
                            onClick={() => {
                              handleEdit(item.templateIdUsed, item.widgetId);
                            }}
                            my="sm"
                            mr="xs"
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setCurrentWidgetId(item.widgetId);
                              setInstallWidgetModalOpen(true);
                            }}
                            my="sm"
                            mr="xs"
                          >
                            Install
                          </Button>
                        </div>
                        <div style={{ alignSelf: "flex-end" }}>
                          <Button
                            color="red"
                            onClick={() => {
                              setCurrentWidgetId(item.widgetId);
                              setDeleteModalOpen(true);
                            }}
                            my="sm"
                            mr="xs"
                          >
                            Delete
                          </Button>
                        </div>

                        {/* Install widget modal  */}
                        <Modal
                          size="xl"
                          opened={isInstallWidgetModalOpen}
                          onClose={() => setInstallWidgetModalOpen(false)}
                          title="Install Widget"
                          styles={{
                            title: { fontSize: "20px", fontWeight: "bold" },
                          }}
                        >
                          <InstallWidgetModal widgetId={currentWidgetId!} />
                        </Modal>

                        {/* Delete widget modal  */}
                        <Modal
                          opened={isDeleteModalOpen}
                          onClose={() => setDeleteModalOpen(false)}
                          title="Confirm Deletion"
                        >
                          <Text size="sm">
                            Deleting a widget will also delete all embed links.
                            Are you sure you want to continue?
                          </Text>
                          <Button
                            color="red"
                            onClick={() => handleDelete(currentWidgetId)}
                            mt="md"
                          >
                            Yes, delete it
                          </Button>
                          <Button
                            variant="subtle"
                            onClick={() => setDeleteModalOpen(false)}
                            mt="md"
                          >
                            Cancel
                          </Button>
                        </Modal>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                    margin: 8,
                  }}
                >
                  <NoDataIcon />
                  <Text fw={600} fz={20} mt="md">
                    No widgets as of now
                  </Text>
                </div>
              )}
            </div>
          </Container>
          <ProfileModal
            isProfileModalOpen={isProfileModalOpen}
            setProfileModalOpen={setProfileModalOpen}
          />
        </div>
      </div>
    </AuthOrNot>
  );
}
