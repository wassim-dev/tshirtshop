import React from "react";
import Fab from "@material-ui/core/Fab";
import NavigateNext from "@material-ui/icons/NavigateNext";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
export default function Paginations(props) {
  let listPages = getPaginationList(
    props.page || 1,
    props.nbrPages || 1,
    props.limitPages || 4
  );

  return (
    <div
      style={{ disabled: "flex", alignItems: "center" }}
      className="paginationlist"
    >
      {listPages.map(elm => {
        switch (elm.type) {
          case "previous":
            return (
              <Fab
                disabled={elm.disabled}
                key={elm.key}
                size="small"
                color="default"
                onClick={() => !elm.disabled && props.goToPage(elm.page)}
              >
                <NavigateBefore />
              </Fab>
            );
          case "next":
            return (
              <Fab
                disabled={elm.disabled}
                key={elm.key}
                onClick={() => !elm.disabled && props.goToPage(elm.page)}
                size="small"
                color="default"
              >
                <NavigateNext />
              </Fab>
            );
          case "suparator":
            return (
              <span className="pagination-separator" key={elm.key}>
                ...
              </span>
            );
          case "page":
            return (
              <Fab
                key={elm.key}
                onClick={() => !elm.disabled && props.goToPage(elm.page)}
                size="small"
                color={elm.disabled ? "secondary" : "default"}
                style={{ margin: "0 5px" }}
              >
                {elm.page}
              </Fab>
            );
          default:
            return <div key={elm.key} />;
        }
      })}
    </div>
  );
}

function getPaginationList(page, nbrPages, limitpages = 4) {
  if (nbrPages <= 1) return [];
  var list = [];
  list.push({
    type: "previous",
    key: 0,
    disabled: page === 1,
    page: page > 1 && page - 1
  });
  list.push({
    type: "page",
    page: 1,
    key: 1,
    active: page === 1,
    disabled: page === 1
  });
  if (page > limitpages + 2) list.push({ type: "suparator", key: -1 });
  for (
    var i = Math.max(2, page - limitpages);
    i <= Math.min(nbrPages - 1, page + limitpages);
    i++
  ) {
    list.push({
      type: "page",
      page: i,
      key: i,
      active: page === i,
      disabled: page === i
    });
  }
  if (page < nbrPages - limitpages - 1)
    list.push({ type: "suparator", key: -2 });
  list.push({
    type: "page",
    page: nbrPages,
    key: nbrPages,
    active: page === nbrPages,
    disabled: page === nbrPages
  });
  list.push({
    type: "next",
    key: nbrPages + 1,
    disabled: page === nbrPages,
    page: page < nbrPages && page + 1
  });
  return list;
}
