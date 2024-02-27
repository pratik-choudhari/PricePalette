import { useState } from "react";
import { UnstyledButton, Tooltip, Title, rem, Text, Flex } from "@mantine/core";
import {
  IconTextSize,
  IconPalette,
  IconLayout,
  TablerIconsProps,
} from "@tabler/icons-react";
import classes from "@/styles/editTemplate.module.css";
import { useMetaData } from "@/stores/useMetaData";
import { useGetUrlId } from "@/utils/useGetUrlId";
import DynamicTemplateLoader from "@/components/DynamicTemplateLoader";

type WidgetSettingType = "Cards" | "Color" | "Labels";

const mainLinksMockdata: {
  icon: (props: TablerIconsProps) => JSX.Element;
  label: WidgetSettingType;
}[] = [
  { icon: IconLayout, label: "Cards" },
  { icon: IconPalette, label: "Color" },
  { icon: IconTextSize, label: "Labels" },
];

export default function EditTemplatePage() {
  // getting the widget id from url
  const widgetId = useGetUrlId();
  const metadata = useMetaData((state) => state.metaData);
  const setMetaData = useMetaData((state) => state.setMetaData);

  console.log("widget id: ", widgetId);

  const [active, setActive] = useState<WidgetSettingType>("Cards");

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={classes.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <Flex style={{ height: "100vh" }}>
      <nav className={classes.navbar} style={{ height: "100%", width: "20%" }}>
        <div className={classes.wrapper}>
          <div className={classes.aside}>
            <div className={classes.logo}>
              <Text>Temp</Text>
            </div>
            {mainLinks}
          </div>
          <div className={classes.main}>
            <Title order={4} className={classes.title}>
              {active}
            </Title>

            {active}
          </div>
        </div>
      </nav>
      <div
        style={{
          width: "80%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <DynamicTemplateLoader id={Number(widgetId)} />
      </div>
    </Flex>
  );
}
