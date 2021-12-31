import {
  Flex,
  Heading,
  HStack,
  Image,
  Icon,
  useToast,
  Spinner,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { IContext } from "../context";
import { FaListUl } from "react-icons/fa";
// import { AiTwotoneCopy } from "react-icons/ai";
import { IoIosCopy } from "react-icons/io";
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { BsFillGridFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { copyToClip } from "../../../utils/copy-clip";
import useDownPackage from "../../../hooks/useDownPackage";
import useFileUrl from "../../../hooks/useFileUrl";

const Header = () => {
  const downPack = useDownPackage();
  const { t } = useTranslation();
  const fileUrl = useFileUrl();
  const toast = useToast();
  const { show, setShow, type, getSetting, files, multiSelect, selectFiles } =
    useContext(IContext);
  const logos = getSetting("logo");
  const logo = useColorModeValue(
    logos.split(",").shift(),
    logos.split(",").pop()
  ) as string;
  return (
    <Flex className="header" px="2" py="2" justify="space-between" w="full">
      <Link to="/" className="logo">
        {logo.includes("http") ? (
          <Image
            fallback={
              <Spinner color={getSetting("icon color") || "teal.300"} />
            }
            rounded="lg"
            h="44px"
            w="auto"
            src={logo}
          />
        ) : (
          <Heading>{logo}</Heading>
        )}
      </Link>
      <HStack className="buttons" spacing="2">
        {type === "file" ? (
          <Tooltip
            shouldWrapChildren
            hasArrow
            placement="bottom"
            label={t("Download")}
          >
            <Icon
              cursor="pointer"
              boxSize={6}
              as={BsFillArrowDownCircleFill}
              onClick={() => {
                if (type === "file") {
                  let url = fileUrl();
                  window.open(url, "_blank");
                  return;
                }
                // if (multiSelect) {
                //   downPack(selectFiles);
                //   return;
                // }
                // if (type === "folder") {
                //   downPack(files);
                //   return;
                // }
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip
            shouldWrapChildren
            hasArrow
            placement="bottom"
            label={t("Upload")}
          >
            <Icon
              cursor="pointer"
              boxSize={6}
              as={BsFillArrowUpCircleFill}
              onClick={() => {
                // TODO: upload
              }}
            />
          </Tooltip>
        )}
        {type !== "error" && (
          <Tooltip
            shouldWrapChildren
            hasArrow
            placement="bottom"
            label={t("Copy direct link")}
          >
            <Icon
              cursor="pointer"
              boxSize={6}
              as={IoIosCopy}
              onClick={() => {
                let content = "";
                if (type === "file") {
                  content = fileUrl();
                } else {
                  let files_ = files;
                  if (multiSelect) {
                    files_ = selectFiles;
                  }
                  content = files_
                    .filter((file) => file.type !== 1)
                    .map((file) => {
                      return fileUrl(file);
                    })
                    .join("\n");
                }
                copyToClip(content);
                toast({
                  title: t("copied"),
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              }}
            />
          </Tooltip>
        )}
        <Tooltip
          shouldWrapChildren
          hasArrow
          placement="bottom"
          label={t("switch to layout view", {
            layout: t(show === "list" ? "grid" : "list"),
          })}
        >
          <Icon
            boxSize={6}
            cursor="pointer"
            onClick={() => {
              setShow!(show === "list" ? "grid" : "list");
              localStorage.setItem("show", show === "list" ? "grid" : "list");
            }}
            as={show === "list" ? BsFillGridFill : FaListUl}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default Header;
