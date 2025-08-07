import { ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { requestLogOut } from "@/entities/auth/api";
import { Button, Dialog, DialogContent, DialogTrigger } from "@/shared/ui";
import { EditProfile } from "./EditProfile";
import { Inquiry } from "./Inquiry";
import { TermsOfUse } from "./TermsOfUse";

type ViewType = "EDIT_PROFILE" | "TERMS_OF_USE" | "INQUIRY";

const VIEW_TYPE = [
  { label: "프로필 편집", value: "EDIT_PROFILE" as ViewType },
  { label: "사용 약관", value: "TERMS_OF_USE" as ViewType },
  { label: "1:1 문의/건의하기", value: "INQUIRY" as ViewType },
];

export const ManageSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewType>("EDIT_PROFILE");
  const navigate = useNavigate();

  const renderView = () => {
    switch (view) {
      case "EDIT_PROFILE":
        return <EditProfile onCancel={() => setIsOpen(false)} />;
      case "TERMS_OF_USE":
        return <TermsOfUse />;
      case "INQUIRY":
        return <Inquiry />;
    }
  };

  const handleLogOut = async () => {
    await requestLogOut();
    navigate("/login");
  };

  return (
    <div className="flex">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Settings size={18} className="cursor-pointer text-grayscale-700" />
        </DialogTrigger>
        <DialogContent className="flex h-1/2 w-1/2 gap-0 rounded-lg p-0">
          <div className="flex h-full w-48 flex-col rounded-l-lg bg-grayscale-100 px-1">
            <header className="flex h-20 w-full items-center justify-start px-2">
              <h2 className="text-bold-l text-grayscale-black">설정</h2>
            </header>

            <div className="flex flex-1 flex-col items-start space-y-1">
              {VIEW_TYPE.map((val) => {
                return (
                  <Button
                    key={val.value}
                    variant="ghost"
                    className="flex w-full justify-between"
                    onClick={() => setView(val.value)}
                  >
                    <span className="text-grayscale-700 text-medium-s">{val.label}</span>
                    <ChevronRight />
                  </Button>
                );
              })}
            </div>

            <div className="pb-4">
              <Button
                variant="link"
                className="flex cursor-pointer justify-start text-grayscale-500 text-medium-s underline"
                onClick={handleLogOut}
              >
                로그아웃
              </Button>
            </div>
          </div>

          {renderView()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
